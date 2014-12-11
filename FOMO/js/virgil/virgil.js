/* The Virgil Class. */
function Virgil(){

	sessionStorage.setItem("onroute", "inmaps");

	//PING variables
	var mPingInterval = 30000;			//Number of milliseconds to wait between ping calls.
	var mPingTimeout = 20000;			//Number of milliseconds before registering a ping timeout.
	var mPingDistance = 10;				//Number of meters necessary to register arrival.
											//suggestedMin: 10-20

	//STANDBY variables
	var mStandbyInterval = 120000;		//Number of milliseconds to wait between standby calls.
	var mStandbyTimeout = 20000;		//Number of milliseconds before registering a standby timeout.
	var mStandbyDistance = 10;			//Number of meters necessary to register departure.
											//suggestedMin: 10-20

	//STATIONARY variables
	var mStationaryCount = 0;			//Number of consecutive pings that have registered as stationary.
	var mStationaryThreshold = 5;		//Number of consecutive stationary registrations before a stationary call.
	var mStationaryDistance = 10;		//Number of meters necessary to register as stationary.
											//suggestedMin: 10-20

	var virgilEngine;					//Timer obj running Virgil.

	/* ------------------------------------------------------------------------------------- */

	prepare();

	/* ------------------------------------------------------------------------------------- */

	/* Preps for use. */
	function prepare(){

		//reset display
		$("#virgilContent").children().remove();
		$("#virgilPage .content").attr('style', 'visibility: visible !important; text-align: center; color: white !important;');

		//set kill switch
		$("#virgilPage").one('pagehide', function (event, ui) {
			//turn off background permissions
			window.plugin.backgroundMode.disable();
			//kill virgil engine
			clearTimeout(virgilEngine);
		});

		//get the destination lat/lng
		var places = JSON.parse(sessionStorage.getItem("places"));
		var destination;
		//find current destination and get location
		$.each(places,  function(key,val){
			if(!val.arrived){
				destination = val;
				return false;
			}
		});

		//learn new places
		learn(places);
		//start tracking
		ping(destination, mPingInterval, mPingTimeout, mPingDistance);

		//set permissions to allow running in background
		window.plugin.backgroundMode.enable();
		//mark routing in session and display gmaps
		sessionStorage.setItem("onroute", "inmaps");
		var mapString = sessionStorage.getItem("mapString");
		window.open(mapString, '_system', 'location=no');
	}

	/* ----------------- MEMORY ----------------- */

	/* Retreives all saved Places from memory. */
	function remember(){
		if(localStorage.getItem("memories")){
			return JSON.parse(localStorage.getItem("memories"));
		}
		else{
			return [];
		}
	}

	/* Saves a new Place in memory. */
	function learn(places){
		var memories = remember();
		$.each(places, function(key1, place){
			var known = false;
			$.each(memories, function(key2, memory){
				if(place.formatted_address == memory.formatted_address){
					known = true;
					return;
				}
			});
			if(known == false){
				memories.push(place);
			}
		});
		localStorage.setItem("memories", JSON.stringify(memories));
	}

	/* ----------------- ACTIVE ----------------- */

	/* Checks the user's location every interval. 
	 * @param destination The destination you are comparing the user's location against.
	 * @param pingInterval The interval at which to recursively call pinging. 
	 * @param pingTimeout The length of time before pinging times out on an attempted Ping. 
	 * @param pingDistance The minimum distance for the user to fire arrival.
	 */
	function ping(destination, pingInterval, pingTimeout, pingDistance){		
		console.log("ping");
		navigator.geolocation.getCurrentPosition(function(location){
			var myTime = moment();
			$("#virgilContent").append($("<p/>",{
				'text':'ping '  + ' @ ' + myTime.hours() + ":" + myTime.minutes() + ":" + myTime.seconds(),
				//'style':"width:150px;",
			}));
			$("#virgilContent").css('left', ($(window).width()/2)-($("#virgilContent").width()/2) );
			$("#virgilContent").css('top', '60px');
			//record location
			reportLocation(location);
			//on location found, check if triggered
			analyzePing(location, destination, pingDistance, function(found){
				//if found: perform arrival
				if(found == true){
					clearTimeout(virgilEngine);
					arrival(destination);
				}
				//if not found: recalibrate and retry
				else{
					clearTimeout(virgilEngine);
					virgilEngine = setTimeout(function() {
						ping(destination, pingInterval, pingTimeout, pingDistance);
					}, pingInterval);
				}
			});
		}, function(e){
			var myTime = moment();
			$("#virgilContent").append($("<p/>",{
				'text':e.message + ' @ ' + myTime.hours() + ":" + myTime.minutes() + ":" + myTime.seconds(),
				'style':"width:150px;",
			}));
			$("#virgilContent").css('left', ($(window).width()/2)-($("#virgilContent").width()/2) );
			console.log(e);
			//recursive call
			ping(destination, pingInterval, pingTimeout, pingDistance);
		}, {timeout:pingTimeout, enableHighAccuracy: true, maximumAge:10000});
	} //End ping()

	/* Check if the user is within pingDistance of the next Checkpoint.
	 * @param pingDistance The minimum distance for the user to fire arrival.
	 * @param location The minimum distance for the user to fire arrival.
	 * @return boolean Has the given location been reached?
	 */
	function analyzePing(location, destination, pingDistance, callback){
		var found = false;
		getDistance(location, destination, function(distanceToDestination){
			if(distanceToDestination < pingDistance){
				found = true;
			}
			//if getDistance() error
			if(distanceToDestination == -1){
				found = false;
			}
			if(found == false){
				//TODO: implement stationary
				if(mStationaryCount < mStationaryThreshold){
					mStationaryCount++;
				}
				else{
					mStationaryCount = 0;
					stationary();
				}
			}
			callback(found);
		});
	}

	/* Performs all necessary actions on arriving.
	 */
	function arrival(destination){
		//log arrival in session
		var places = JSON.parse(sessionStorage.getItem("places"));
		$.each(places,  function(key,val){
			if(!val.arrived){
				val.arrived = true;
				return false;
			}
		});
		//push notification to user
		try{
			//add printout to screen
			$("#virgilContent").append($("<p/>",{
				'text':'You have arrived. Where to next?',
			}));
			$("#virgilContent").css('left', ($(window).width()/2)-($("#virgilContent").width()/2) );
			$("#virgilContent").css('top', '60px');
			if(localStorage.getItem("pushwooshToken")){
				sendPushNotification("You have arrived. Where to next?");
			}
			else{
				console.log("You have arrived. Where to next?");
			}
		}catch(e){
			console.log(e);
		}
		//initiate standby
		clearTimeout(virgilEngine);
		virgilEngine = setTimeout(function() {
			standby(destination, mStandbyInterval, mStandbyTimeout, mStandbyDistance);
		}, mStandbyInterval);
	}

	/* Performs all necessary actions on registering as stationary.
	 */
	function stationary(){
		//push notification to user
		try{
			//add printout to screen
			$("#virgilContent").append($("<p/>",{
				'text':"It looks like you've stopped!?",
			}));
			$("#virgilContent").css('left', ($(window).width()/2)-($("#virgilContent").width()/2) );
			$("#virgilContent").css('top', '60px');
			if(localStorage.getItem("pushwooshToken")){
				sendPushNotification("It looks like you've stopped!?");
			}
			else{
				console.log("It looks like you've stopped!?");
			}
		}catch(e){
			console.log(e);
		}
	}

	/* ----------------- STANDBY ----------------- */

	/* Puts Virgil in standby awaiting the user to begin moving again. 
	 * @param standbyInterval The interval at which to recursively call standby. 
	 * @param standbyTimeout The length of time before pinging times out on an attempted standby. 
	 * @param standbyDistance The minimum distance for the user to fire depart().
	 */
	function standby(origin, standbyInterval, standbyTimeout, standbyDistance){
		var myTime = moment();
		$("#virgilContent").append($("<p/>",{
			'text':'standby ' + myTime.minutes(),
		}));
		$("#virgilContent").css('top', ($(window).height()/2)-($("#virgilContent").height()/2) );
		$("#virgilContent").css('left', ($(window).width()/2)-($("#virgilContent").width()/2) );
		navigator.geolocation.getCurrentPosition(function(location){
			//on location found, check if triggered
			analyzeStandby(location, origin, standbyDistance, function(moving){
				//if moving: perform depart
				if(moving == true){
					clearTimeout(virgilEngine);
					departure();
				}
				//if not moving: standby
				else{
					clearTimeout(virgilEngine);
					virgilEngine = setTimeout(function() {
						standby(origin, standbyInterval, standbyTimeout, standbyDistance);
					}, standbyInterval);
				}
			});
		}, function(e){
			console.log(e);
			//recursive call
			standby(origin, standbyInterval, standbyTimeout, standbyDistance);
		}, {timeout:standbyTimeout, enableHighAccuracy: true, maximumAge:10000});
	}

	/* Check if the user has departed a known location.
	 * @param pingDistance The minimum distance for the user to fire departure.
	 * @param location The minimum distance for the user to fire departure.
	 * @return boolean Has the given location been departed?
	 */
	function analyzeStandby(location, origin, pingDistance, callback){
		getDistance(location, origin, function(distanceFromOrigin){
			var moving = false;
			if(distanceFromOrigin > pingDistance){
				moving = true;
			}
			//if getDistance() error
			if(distanceFromOrigin == -1){
				moving = false;
			}
			if(moving == false){
				//TODO: add still-searching indication for testing
			}
			callback(moving);
		});
	}

	/* Initiates all automations when standby() detects a departure. */
	function departure(){
		try{
			$("#virgilContent").append($("<p/>",{
				'text':"Would you like Virgil's help while travelling?",
			}));
			$("#virgilContent").css('top', ($(window).height()/2)-($("#virgilContent").height()/2) );
			$("#virgilContent").css('left', ($(window).width()/2)-($("#virgilContent").width()/2) );
			if(localStorage.getItem("pushwooshToken")){
				sendPushNotification("Would you like Virgil's help while travelling?");
			}
			else{
				console.log("Would you like Virgil's help while travelling?");
			}
		}catch(e){
			console.log(e);
		}
	}

	/* ----------------- UTILITIES ----------------- */

	/* Calculates the distance from the User to a given location. 
	 * @param location The location object returned by the User's geolocation check.
	 * @param checkpoint The User's destination Checkpoint.
	 * @return number The distance from the given location to the given Checkpoint.
	 */
	function getDistance(location, target, callback){
		//calc distance to destination
		var distanceToTarget = -1;
		var originLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
		var destinationLocation = target.geometry.location.B ? new google.maps.LatLng(target.geometry.location.k, target.geometry.location.B) : new google.maps.LatLng(target.geometry.location.k, target.geometry.location.D);
		var service = new google.maps.DistanceMatrixService();
		service.getDistanceMatrix({
		    origins: [originLocation],
		    destinations: [destinationLocation],
		    travelMode: google.maps.TravelMode.DRIVING,
		    avoidHighways: false,
		    avoidTolls: false
	    },
	    function(response, status){
	    	distanceToTarget = response.rows[0].elements[0].distance.value;
	    	if(distanceToTarget == -1){
				console.log("getDistance() error");
			}
			callback(distanceToTarget);
	    });
	}

} //End Virgil()