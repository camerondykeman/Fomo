	
function signin(){

	//clear session
	sessionStorage.clear();

	//set layout
	$("#signinNextButton").css("display", "none");
	$("#signinNextButton").css("opacity", "0");
	$("#signinError").hide();

	$("#signinTelephone").intlTelInput({
        "autoFormat":true,
        "preferredCountries":["ca", "us", "gb"],
        "utilsScript":"js/intl-tel-input-master/lib/libphonenumber/build/utils.js"
    });

	//PIN listeners
	var oldTop = 0;
	$("#signinPIN").on('focusin', function(){
		$(this).parent().css("background-color","white");
		$(this).css("cssText", "color: rgb(120,52,209) !important");
	});
	$("#signinTelephone").on('focusin', function(){
		$(this).parent().parent().css("background-color","white");
		$(this).parent().css("background-color","white");
		$(this).css("cssText", "color: rgb(120,52,209) !important");
		$(this).css("padding-left", ".4em");
	});

	$("#signinPIN").on('focusout', function(){
		if($(this).val() != "" && $(this).val().length == 4){
			$(this).parent().css("background-color","transparent");
			$(this).parent().css("text-shadow","none");
			$(this).css("cssText", "color: rgb(255,255,255) !important");
		}
	});
	$("#signinTelephone").on('focusout', function(){
		if($(this).val() != "" && $(this).val().length == 15){
			$(this).parent().parent().css("background-color","transparent");
			$(this).parent().css("background-color","transparent");
			$(this).parent().css("text-shadow","none");
			$(this).css("cssText", "color: rgb(255,255,255) !important");
			$(this).css("padding-left", ".4em");
		}
	});

	$("#signinPIN").on("keyup", function(){
		if($("#signinPIN").val().length == 4){
			$("#signinPIN").trigger("blur");
		}
		if($("#signinError").css("display") == "block"){
			$("#signinContent").animate({'top':$("#signinContent").position().top + 60}, 500);
			$("#signinError").hide(500);
		}
	});
	$("#signinTelephone").on("keyup", function(){
		if($("#signinError").css("display") == "block"){
			$("#signinContent").animate({'top':$("#signinContent").position().top + 60}, 500);
			$("#signinError").hide(500);
		}
	});

	//shared listener
	$("#signinPage .search").on('focusout', function(){
		var fields = $("#signinContent").find(".search");
		var complete = [];
		$.each(fields, function(key, val){
			if($(val).css("color") == "rgb(255, 255, 255)"){
				complete.push(val);
			}
		});
		if(complete.length == 2){
			//show button
			$("#signinNextButton").css("display", "block");
			$("#signinNextButton").animate({"opacity": "1"},500);
		}
		else{
			//hide button				
			$("#signinNextButton").animate({"opacity": "0"},500, function(){
				$("#signinNextButton").css("display", "none");
			});
		}
	});

	//center
	$("#signinContent").css('top', ($(window).height()/2)-($("#signinContent").height()/2) );
	$("#signinContent").css('left', ($(window).width()/2)-($("#signinContent").width()/2) );

	//reset session
	sessionStorage.removeItem("places");
	sessionStorage.removeItem("people");

	//show
	$(".flag-dropdown").css("display", "none");
    $("#signinTelephone").parent().css("width", "100%");
    $("#signinPIN").css("text-shadow", "none");
    $("#signinPIN").css("cssText", "color: rgb(120,52,209) !important");
    $("#signinPIN").parent().css("background-color","white");
    $("#signinTelephone").css("text-shadow", "none");
    $("#signinTelephone").css("cssText", "color: rgb(120,52,209) !important; padding-left: .4em !important;");
    $("#signinTelephone").parent().css("background-color","white");
    $("#signinTelephone").attr("placeholder", "telephone");
    $("#signinContent").trigger('create');
	$("#signinContent").css('visibility', 'visible');
}