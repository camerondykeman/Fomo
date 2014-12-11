
function signup(){

	//clear session
	sessionStorage.clear();
	
	//reset display
	$("#signupPINConfirm").parent().css("display", "none");
	$("#signupPINConfirm").parent().css("opacity", "0");
	$("#signupNextButton").css("display", "none");
	$("#signupNextButton").css("opacity", "0");
	$('#signupPage .search').parent().css("text-shadow","inherit");
	$('#signupPage .search').parent().css("background-color","white");
	$('#signupPage .search').css("cssText","color: #7834D1 !important");
	$(".search").val("");
	$("#signupContent").trigger("create");
	$("#signupError").hide();

	//set Telephone widget on PEC popup
	$("#signupTelephone").intlTelInput({
        "autoFormat":true,
        "preferredCountries":["ca", "us", "gb"],
        "utilsScript":"js/intl-tel-input-master/lib/libphonenumber/build/utils.js"
    });
    $(".flag-dropdown").css("display", "none");
    $("#signupTelephone").css("padding-left", "0px");
    $("#signupTelephone").parent().css("width", "100%");

	//set focusin listeners
	//all but telephone
	var oldTop = 0;
	$("#signupEmail, #signupPIN, #signupPINConfirm, #signupFirstName, #signupLastName").on('focusin', function(){
		//highlight
		if($(this).val() != "" ){
			$(this).parent().css("background-color","white");
			$(this).css("cssText", "color: #7834D1 !important");
		}
	});
	$("#signupTelephone").on('focusin', function(){
		//highlight
		if($(this).val() != "" ){
			$(this).parent().parent().css("background-color","white");
			$(this).css("cssText", "color: #7834D1 !important");
			$(this).css("padding-left", "0px");
		}
	});
	//names
	$("#signupFirstName, #signupLastName").on('focusout', function(){
		//if all characters filled
		//visualize telephone finished
		if($(this).val() != ""){
			$(this).parent().css("background-color","transparent");
			$(this).css("cssText", "color: white !important");
			$(this).css("text-shadow","none");
		}
	});
	//email
	$("#signupEmail").on('focusout', function(){
		//if email validated
		//visualize email finished
		var emailRegex = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;
		if($(this).val() != "" && emailRegex.test($(this).val())){
			$(this).parent().css("background-color","transparent");
			$(this).css("cssText", "color: white !important");
			$(this).css("text-shadow","none");
		}
	});
	//phone
	$("#signupTelephone").on('focusout', function(){
		//if all characters filled
		//visualize telephone finished
		if($(this).val() != ""){
			$(this).parent().parent().css("background-color","transparent");
			$(this).css("cssText", "color: white !important");
			$(this).css("text-shadow","none");
			$(this).css("padding-left", "0px");
		}
	});
	//PIN
	$("#signupPIN").on('focusout', function(){
		//if 4 digits
		//visualize pin finished
		if($(this).val().length >= 4){
			$(this).parent().css("background-color","transparent");
			$(this).css("cssText", "color: white !important");
			$(this).css("text-shadow","none");
			
			if($("#signupContent").hasClass("moved") == false){
				//display confirm pin
				var top = $("#signupContent").position().top;
				$("#signupPINConfirm").val("");
				$("#signupPINConfirm").parent().css("display", "block");
				$("#signupPINConfirm").parent().animate({"opacity":"1"}, 500);
				//move content up if required
				$("#signupContent").animate({"top":top - 30}, 500);
				$("#signupContent").addClass("moved");
				oldTop = oldTop - 30;
			}
		}
		else{
			$(this).parent().css("background-color","white");
			$(this).css("cssText", "color: #7834D1 !important");
			//hide confirm pin
			if($("#signupContent").hasClass("moved") == true){
				var top = $("#signupContent").position().top;
				$("#signupContent").animate({"top":top + 30}, 500);
				$("#signupContent").removeClass("moved");
				oldTop = oldTop + 30;
				$("#signupPINConfirm").parent().animate({"opacity":"0"}, 500, function(){
					$("#signupPINConfirm").parent().css("display", "none");
				});
			}
		}
	});
	//PIN Confirm
	$("#signupPINConfirm").on('focusout', function(){
		//if 4 digits
		//visualize pin finished
		if($(this).val().length >= 4){
			$(this).parent().css("background-color","transparent");
			$(this).css("cssText", "color: white !important");
			$(this).css("text-shadow","none");
		}
		else{
			$(this).parent().css("background-color","white");
			$(this).css("cssText", "color: #7834D1 !important");
		}
		if($("#signupPIN").val() != $("#signupPINConfirm").val()){
			$("#signupPIN").css("cssText", "color: rgb(236,101,116) !important");
			$("#signupPINConfirm").css("cssText", "color: rgb(236,101,116) !important");
		}
		else{
			$("#signupPIN").css("cssText", "color: rgb(255,255,255) !important");
			$("#signupPINConfirm").css("cssText", "color: rgb(255,255,255) !important");
		}
	});
	//general focusout
	$("#signupPage .search").on('focusout', function(){

		setTimeout(function(){
			var fields = $("#signupContent").find(".search");
			var complete = [];
			$.each(fields, function(key, val){
				if($(val).css("color") == "rgb(255, 255, 255)"){
					complete.push(val);
				}
			});
			//show 'signup' if all valid
			if( $("#signupPIN").val() == $("#signupPINConfirm").val() && complete.length == 6){
				$("#signupNextButton").css("display", "block");
				$("#signupNextButton").animate({"opacity":"1"},500);
			}
			else{
				$("#signupNextButton").animate({"opacity":"0"},500, function(){
					$("#signupNextButton").css("display", "none");
				});
			}
		}, 500);
		
		
	});

	//set email keyup
	$("#signupEmail").on("keyup", function(event){
		if (event.keyCode == 13) {
			$("#signupEmail").blur();
			$("#signupTelephone").focus();
		}
		if($("#signupError").css("display") == "block"){
			$("#signupError").hide(500);
		}
	});
	$("#signupTelephone").on("keyup", function(event){
		if (event.keyCode == 13) {
			$("#signupTelephone").blur();
			$("#signupPIN").focus();
		}
		if($("#signupError").css("display") == "block"){
			$("#signupError").hide(500);
		}
	});
	//set PIN keyup
	$("#signupPIN").on("keyup", function(){
		//if all 4 digits filled, display PINConfirm
		if($("#signupPIN").val().length == 4){
			$("#signupPIN").blur();
			$("#signupPINConfirm").focus();
			if($("#signupPINConfirm").val() == "" && $("#signupPINConfirm").css("color") == "rgb(236, 101, 116)"){
				$('#signupPINConfirm').parent().css("background-color","white");
				$("#signupPINConfirm").css("cssText", "color: rgb(120,52,209) !important");
			}
		}
		//else if PINConfirm was showing, hide
		else{
			//hide confirm pin
			if($("#signupContent").hasClass("moved") == true){
				var top = $("#signupContent").position().top;
				$("#signupContent").animate({"top":top + 30}, 500);
				$("#signupContent").removeClass("moved");
				$("#signupPINConfirm").parent().animate({"opacity":"0"}, 500, function(){
					$("#signupPINConfirm").parent().css("background-color","white");
					$("#signupPINConfirm").css("cssText", "color: #7834D1 !important");
					$("#signupPINConfirm").parent().css("display", "none");
				});
			}
		}
	});
	//set PINConfirm keyup
	$("#signupPINConfirm").on("keyup", function(){
		//if all 4 filled and PINs match, focusout
		if($("#signupPINConfirm").val().length == 5 && $("#signupPIN").val() == $("#signupPINConfirm").val()){
			$('#signupPINConfirm').trigger('blur');
		}
	});

	//center
	setTimeout(function(){
		$("#signupContent").css('top', ($(window).height()/2)-($("#signupContent").height()/2) );
		$("#signupContent").css('left', ($(window).width()/2)-($("#signupContent").width()/2) );
		
		//show
		$("#signupContent").css('visibility', 'visible');
	}, 500);

}
	



	