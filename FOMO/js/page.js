
$(this).on("pagebeforeshow", function (event, ui) {
	$(".content").css('visibility', 'hidden');
});

$(this).one("pagecontainershow", function (event, ui) {

	///initialize pushwoosh services
    try{
        app.initialize();
    }catch(e){
        console.log(e);
    }

	//set pageshow
	$(this).on("pagecontainershow", function (event, ui) {
		var pageid = $.mobile.activePage.attr('id');

		if(pageid == "welcomePage"){
			welcome();
		}
		if(pageid == "signupPage"){
			signup();
		}
		if(pageid == "signinPage"){
			signin();
		}
		if(pageid == "wherePage"){
			where();
		}
		if(pageid == "whoPage"){
			who();
		}
		if(pageid == "virgilPage"){
			Virgil();
		}
	});
	
	var page = $.mobile.activePage.attr('id');
	if(page == "welcomePage" || page == "whoPage"){

		//test if signed up
		if(localStorage.getItem("fomo")){
			if(sessionStorage.getItem("onroute")){
				$.mobile.changePage("#whoPage", {allowSamePageTransition: true});
			}
			else{
				//start
				if(page == "welcomePage"){
					welcome();
				}
				if(page == "whoPage"){
					who();
				}
			}
		}
		else{
			//start
			if(page == "welcomePage"){
				welcome();
			}
			if(page == "whoPage"){
				who();
			}
		}
	}
	if(page == "welcomePage"){
		sessionStorage.clear();
	}
	if(page == "signinPage"){
		signin();
	}
	if(page == "signupPage"){
		signup()
	}
	if(page == "wherePage"){
		where();
	}
	if(page == "virgilPage"){
		Virgil();
	}
});

$(this).on("pagehide", function (event, ui) {
	var pageid = $.mobile.activePage.attr('id');

	if(pageid == "whoPage"){
		$("#whoScroll").children().remove();
	}
});