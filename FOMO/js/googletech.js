function initGoogleSearch(){
	var markers = [];
	navigator.geolocation.getCurrentPosition(function(location){
		//center
		if(sessionStorage.getItem("places")){
			if(JSON.parse(sessionStorage.getItem("places")).length <= 1){
				$("#whereNextButton").css('display', 'none');
				$("#whereSecondaryControl").css('display', 'none');
			}
		}
		$("#whereContent").css('top', ($(window).height()/2)-($("#whereContent").height()/2) );
		$("#whereContent").css('left', ($(window).width()/2)-($("#whereContent").width()/2) );
		//set up autocomplete
		var latlng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
		sessionStorage.setItem("geo", JSON.stringify(latlng));
		var geocoder = new google.maps.Geocoder();
		var place;
		geocoder.geocode({'latLng': latlng}, function(results, status) {
            if(status == google.maps.GeocoderStatus.OK) {
				var places = [];
	        	if(sessionStorage.getItem("places")){
	        		places = JSON.parse(sessionStorage.getItem("places"));
	        	}
	        	places[0] = results[0];
	        	sessionStorage.setItem("places", JSON.stringify(places));
            };
        });
		//set up google search fields
		initPlaceBox("whereSearch0", 0, latlng);
		//set 'more' listener
		$("#moreButton").click(function(e){
			moreButtonClick(latlng);
		});
		//display
		$("#whereContent").css('visibility', 'visible');
		$.mobile.loading("hide");
	}, function(e){
		console.log(e);
		$.mobile.loading( "show", {
	        text: e.message,
	        textVisible: true,
	        theme: "z",
	        html: ""
	    });
	}, {timeout:120000, enableHighAccuracy: true, maximumAge:10000});
}

function initPlaceBox(inputName, inputNum,  latlng){

	var input = (document.getElementById(inputName));
	var searchBox = new google.maps.places.Autocomplete((input));
	searchBox.setBounds(new google.maps.LatLngBounds(latlng,latlng));
	var markers = [];

	$('#'+inputName).keyup(function(){
		$('#wherePage #'+inputName).parent().css("background-color","white");
		$('#'+inputName).parent().css("text-shadow","inherit");
		$('#'+inputName).css("cssText", "color: rgb(120,52,209) !important");
		$('#'+inputName).css("text-shadow","inherit");
		if($('#'+inputName).val() == ""){
			var myPlaces = [];
			if(sessionStorage.getItem("places")){
				var myPlaces = JSON.parse(sessionStorage.getItem("places"));
				if(myPlaces[inputNum+1]){
					myPlaces[inputNum+1] = "";	
				}
				sessionStorage.setItem("places", JSON.stringify(myPlaces));
			}
		}
	});

	if($('#'+inputName).hasClass("whereSearch")){
		$('#'+inputName).parent().css("border-width", "2px");
	}

	google.maps.event.addListener(searchBox, 'place_changed', function() {
	    var place = searchBox.getPlace();
	    //Visualize choice made
	    $('#'+inputName).parent().css("background-color","transparent");
		$('#'+inputName).parent().css("text-shadow","none");
		$('#'+inputName).css("cssText", "color: rgb(255,255,255) !important");
		$('#'+inputName).css("text-shadow","none");

		//record choice made in session
		var myPlaces = [];
		if(sessionStorage.getItem("places")){
			var myPlaces = JSON.parse(sessionStorage.getItem("places"));
		}
		myPlaces[inputNum+1] = place;
		sessionStorage.setItem("places", JSON.stringify(myPlaces));

		//adjust layout if start/end provided
		if(myPlaces.length >= 2 && $("#whereSecondaryControl").css("display") == "none"){
			//move content up if it fits
			var contentHeight = $("#whereContent").height();
			if(contentHeight + 60 <= $(window).height()){
				$("#whereContent").animate({'top': $("#whereContent").position().top-30 }, 500);
			}
			//else force scroll
			else{
				if($("#whereScroll").css("overflow-y") != "scroll"){
					var maxHeight = $("#whereScroll").height() + 15;
					$("#whereScroll").css("max-height", maxHeight);
					$("#whereScroll").css("margin-top", "-8px");
					$("#whereScroll").css("margin-bottom", "1px");
					$("#whereScroll").css("overflow-y", "scroll");
				}
			}
			//display 'more'
			$("#whereSecondaryControl").show(500);
			$("#whereSearchN").parent().animate({'margin-top': "10px" }, 500);
			//display 'next'
			$("#whereNextButton").css('display', "block");
			$("#whereNextButton").animate({'opacity': "1" }, 500);
		}
	});
}