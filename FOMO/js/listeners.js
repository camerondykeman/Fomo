function moreButtonClick(latlng){
	if(isLegitimateClick()){

		//append new delete
		var searchNum = $("#whereContent").find(".search").length;
		$("#whereSpacer").append($("<input/>",{
			'id':"whereSearchDelete"+searchNum,
			'type':'button',
			'val':'X'
		}));
		//add new search
		$("#whereSpacer").append($("<input/>",{
			"id":"whereSearch"+searchNum,
			"class":"search checkpoint",
			"type":"text",
			"placeholder":"destination " + (searchNum+1),
		}));
		$("#whereContent").trigger("create");
		$("#whereSearchDelete"+searchNum).parent().addClass("checkpointDelete");
		$("#whereSearchDelete"+searchNum).parent().css("display", "none");

		//focusin
		var oldTop = 0;
		$("#whereSearch"+searchNum).on('focusin', function(){
			//show options if checkpoint
			if($("#whereSearch"+searchNum).hasClass("checkpoint")){
				$("#whereSearch"+searchNum).parent().animate({"margin-right":"50px"}, 500);
				setTimeout(function(){
					$("#whereSearchDelete"+searchNum).parent().css("display", "inherit");
					$("#whereSearchDelete"+searchNum).parent().animate({"opacity":"1"}, 500);
				},500);
			}
			//move content up if it has not been moved
			if($("#whereContent").hasClass("keyboard") == false){
				if(oldTop == 0){
					oldTop = $("#whereContent").position().top;
				}
				$("#whereContent").animate({'top':60},500, function(){
					$(".pac-container").animate({'top': $("#whereSearch"+searchNum).position().top + 100}, 500);
				});
				$("#whereContent").addClass("keyboard");
			}
		});
		//focusout
		$("#whereSearch"+searchNum).on('focusout', function(){
			//hide options if checkpoint
			if($("#whereSearch"+searchNum).hasClass("checkpoint")){
				$("#whereSearchDelete"+searchNum).parent().animate({"opacity":"0"}, 500);
				setTimeout(function(){
					$("#whereSearchDelete"+searchNum).parent().css("display", "none");
					$("#whereSearch"+searchNum).parent().animate({"margin-right":"0px"}, 500);
				},500);
			}
			//if content has been moved for keyboard, shift
			setTimeout(function(){
				if($(this).hasClass("ui-focus")==false){
					if($("#whereContent").hasClass("keyboard") == true){
						$("#whereContent").animate({'top':oldTop},500, function(){
							$("#whereContent").removeClass("keyboard");
						});
					}
				}
			},500);
		});
		//delete the option from the list
		$("#whereSearchDelete"+searchNum).click(function(){
			deleteButtonClick(searchNum);
		});
		$("#whereSearch"+searchNum).parent().css("display", "none");
		//add google search
		initPlaceBox("whereSearch"+searchNum, searchNum, latlng);

		//animate new in
		$("#whereSearch"+searchNum).parent().show(500);
		$("#whereSecondaryControl").hide(400);
		if($("#whereScroll").css("overflow-y") == "scroll"){
		  	var scrollHeight = $("#whereScroll").scrollHeight;
		  	$("#whereScroll").animate({ scrollTop: $('#whereScroll')[0].scrollHeight}, 500);
		}
	}
}

function deleteButtonClick(searchNum){
	$("#whereSearch"+searchNum).parent().hide(500);
	$("#whereSecondaryControl").show(400);
	setTimeout(function(){
		//remove from session if perviously added
		if($("#whereSearch"+searchNum).parent().css("background-color") == "rgba(0, 0, 0, 0)"){
			var places = JSON.parse(sessionStorage.getItem("places"));
			places.splice(searchNum, 1);
			sessionStorage.setItem("places", JSON.stringify(places));
		}
		var parent1 = $("#whereSearch"+searchNum).parent();
		var parent2 = $("#whereSearchDelete"+searchNum).parent();
		$("#whereSearch"+searchNum).remove();
		$("#whereSearchDelete"+searchNum).remove();
		$(parent1).remove();
		$(parent2).remove();
	}, 500);
}

function startButtonClick(){
	//get all contacts
	//var contacts = [{"name":"Joe Blow","number":"111-111-1111"}, {"name":"Plain Jane","number":"222-222-2222"}, {"name":"John Doe","number":"333-333-3333"}, {"name":"Lisa Simpson","number":"444-444-4444"}, {"name":"Homer Simpson","number":"555-555-5555"},{"name":"Bart Simpson","number":"666-666-6666"}, {"name":"Marge Simpson","number":"777-777-7777"}];
	try{
		var contacts;
		var options = new ContactFindOptions();
		options.filter = "";
		var filter = ["displayName", "addresses"];
		navigator.contacts.find(filter, function(contacts){
			//get selected contact info
			var selectedFields = $("#whoScroll").find(".whoContactWrap");
			var selected = [];
			$.each(selectedFields, function(key, val){
				var name = $(val).children().text();
				$.each(contacts, function(key2, val2){
					if(val2.name.formatted.toLowerCase() == name){
						selected.push(val2);
					}
				});
			});
			sessionStorage.setItem("people", JSON.stringify(selected));
		}, function(e){
			console.log(e);
		}, options);
	}
	catch(e){
		console.log(e);
	}

	var places = JSON.parse(sessionStorage.getItem("places"));
	var mapString = "https://www.google.ca/maps/dir/";
	$.each(places, function(key, val){
		mapString = mapString + val.formatted_address.split(' ').join('+');
		mapString = mapString + "/";
	});
	
	//TODO: check if the user has the google maps app
	//if they do, load and use
	//if not, move to URL

	//start
	sessionStorage.setItem("mapString", mapString);
	$.mobile.changePage("#virgilPage", {transition:'slide'});
	
}

function signupButtonClick(){
	register();
}

function signinButtonClick(){
	login();
}

var lastTapTime;
function isLegitimateClick() {
	//get time of currentTap
    var currTapTime = new Date().getTime();
    //if there is no lastTap or the currentTap is not a ghostClick, allow it
    if(lastTapTime == null || currTapTime > (lastTapTime + 800)) {
        lastTapTime = currTapTime;
        return true;
    }
    //else block it
    else {
        return false;
    }
}