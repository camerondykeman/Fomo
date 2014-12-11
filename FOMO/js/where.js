
function where(){

	//record signup
	localStorage.setItem("fomo", "signed-up");

	//show loading
	$.mobile.loading( "show", {
        text: "one moment please",
        textVisible: true,
        theme: "z",
        html: ""
    });

	//initialize google search fields, passing the function
	initGoogleSearch(initGoogleSearchDisplay());

	//FOCUS LISTENERS
	var oldTop = 0;
	//FOCUSIN
	$(".whereSearch").on("focusin", function(){
		//move content up if it has not been moved
		if($("#whereContent").hasClass("keyboard") == false){
			if(oldTop == 0 && $("#whereContent").position().top != 0){
				oldTop = $("#whereContent").position().top;
			}
			$("#whereContent").animate({'top':60},500, function(){
				$(".pac-container").animate({'top': $(".whereSearch").position().top + 100}, 500);
			});
			$("#whereContent").addClass("keyboard");
		}
	});
	//FOCUSOUT
	$(".whereSearch").on("focusout", function(){
		setTimeout(function(){
			if($(this).hasClass("ui-focus")==false){
				var allSearchFields = $("#wherePage").find(".search");
				//if no values have been input
				if($(".whereSearch").val() == "" && allSearchFields.length == 1){
					//hide 'more'
					$("#whereSecondaryControl").hide(500, function(){
						var contentHeight = $("#whereScroll").height();
						var scrollHeight = $("#whereScroll").scrollHeight;
						var contentTop = $("#whereContent").position().top;
						$("#whereNextButton").animate({"opacity":"0"},500, function(){
							$("#whereNextButton").css("display", "none");
							//if height of contents are less than the height of the scroll, decrease the height of content
							if((scrollHeight == undefined || scrollHeight <= contentHeight) && contentTop < ($(window).height()/2)-($("#whereContent").height()/2) ){
								//if content has been moved for keyboard, shift
								if($("#whereContent").hasClass("keyboard") == true){
									$("#whereContent").animate({'top':oldTop + 30},500, function(){
										$("#whereContent").removeClass("keyboard");
									});
								}
							}
						});
					});	
				}
				//else if content has been moved for keyboard, shift back
				else{
					$("#whereContent").animate({'top':oldTop},500, function(){
						$("#whereContent").removeClass("keyboard");
					});
				}
			}
		}, 500);
		
	});

	//set page leave
	$("#wherePage").on('pagehide', function(){
		//remove any added searchbars
		$("#whereSpacer").find(".checkpoint").remove();
	});

	function initGoogleSearchDisplay(){
	    //if first time to page during session, reset display
	    if(!sessionStorage.getItem("places")){
	    	$("#whereSecondaryControl").hide();
		    $("#whereNextButton").css("opacity", "0");
			$('.search').parent().css("text-shadow","inherit");
			$('#wherePage .search').parent().css("background-color","white");
			$('.search').css("text-shadow","inherit");
			$('.search').val("");
			$("#whereContent").trigger("create");
		}
		//else load places from session
		else{
			//if only 1 place in session, ignore
			if(JSON.parse(sessionStorage.getItem("places")).length <= 1){
				$("#whereNextButton").css("opacity", "0");
				$('.search').parent().css("text-shadow","inherit");
				$('#wherePage .search').parent().css("background-color","white");
				$('.search').css("text-shadow","inherit");
				$('.search').val("");
				$("#whereContent").trigger("create");
			}
			//if more than 1 place in session, load and display
			else{
				//get places
				var places = JSON.parse(sessionStorage.getItem("places"));
				//set initial field to first place 
				var temp1 = places.shift();
				$("#whereSearch0").val(places[0].formatted_address);
				var temp2 = places.shift();
				//append each place
				$.each(places, function(key,val){
					//append new delete
					var searchNum = key+1;
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
						"val":val.formatted_address,
						"placeholder":"destination " + (searchNum+1),
					}));
					$("#whereContent").trigger("create");
					$("#whereSearchDelete"+searchNum).parent().addClass("checkpointDelete");
					$("#whereSearchDelete"+searchNum).parent().css("display", "none");
					var geo = JSON.parse(sessionStorage.getItem("geo"));
					var latlng = new google.maps.LatLng(geo.k, geo.B);
					initPlaceBox("whereSearch"+searchNum, 0, latlng);
				});

				$('#wherePage .search').parent().css("background-color","transparent");
				$('#wherePage .search').parent().css("text-shadow","none");
				$('#wherePage .search').css("cssText","color: rgb(255,255,255) !important;");

				places.unshift(temp2);
				places.unshift(temp1);
			}
		}
	}

}