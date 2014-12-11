
function welcome(){

	//clear session
	sessionStorage.clear();

	//display appropriate option
	if(localStorage.getItem("fomo")){
		$("#welcomeSignup").css("display","none");
		$("#welcomeSignin").css("display","block");
		$("#welcomeSignin").css("cssText", "color: #7834D1 !important");
		$("#welcomeSignin").css("background-color","white");
		$("#welcomeSignin").css("text-shadow","none");
	}
	else{
		$("#welcomeSignup").css("display","block");
		$("#welcomeSignin").css("display","block");
		$("#welcomeSignin").addClass("lowlight");
	}

	//center
	$("#welcomeContent").css('top', ($(window).height()/2)-($("#welcomeContent").height()/2) );
	$("#welcomeContent").css('left', ($(window).width()/2)-($("#welcomeContent").width()/2) );
	
	//show
	$("#welcomeContent").css('visibility', 'visible');
}