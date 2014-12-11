
function who(){
	//delete blanks in places array left over from wherePage
	var places = JSON.parse(sessionStorage.getItem("places"));
	$.each(places, function(key, val){
		if(val == ""){
			places.splice(key, 1);
		}
	});

	//var contacts = [{"name":"Joe Blow","number":"111-111-1111"}, {"name":"Plain Jane","number":"222-222-2222"}, {"name":"John Doe","number":"333-333-3333"}, {"name":"Lisa Simpson","number":"444-444-4444"}, {"name":"Homer Simpson","number":"555-555-5555"},{"name":"Bart Simpson","number":"666-666-6666"}, {"name":"Marge Simpson","number":"777-777-7777"}];
	//center
	$("#whoContent").css('top', ($(window).height()/2)-($("#whoContent").height()/2) );
	$("#whoContent").css('left', ($(window).width()/2)-($("#whoContent").width()/2) );

	// find all contacts
	try{

		var options = new ContactFindOptions();
		options.filter = '';
    	options.multiple = true
		var fields = ["id", "name", "phoneNumbers"];
		
		navigator.contacts.find(fields, function(contacts){
			if(contacts.length > 0){
				if(contacts[0].name.formatted != null && contacts[0].name.formatted != ""){
					//sort
					var sorted =[];
					$.each(contacts, function(key, value) {
					    sorted.push(value.name.formatted);
					});
					sorted.sort();
					//append each to #whoScroll
					$.each(contacts, function(i,val){

						var contentTop = $("#whoContent").position().top;
						var contentBottom = contentTop + $("#whoContent").height();
						//move content up if it has not reached the top-threshold of 120px
						//else halt movement and implement scroll
						if(contentTop >= 45){
							$("#whoContent").css('top', contentTop-40 );
						}
						else{
							var maxHeight = $("#whoScroll").height();
							$("#whoScroll").css("max-height", maxHeight);
							$("#whoScroll").css("overflow-y", "scroll");
						}
						$("#whoScroll").append($("<div/>",{
							'id':'whoContactWrap'+i,
						}).append($("<p/>",{
							'id':'whoContact'+i,
							'class':'whoContact',
							'text':sorted[i].toLowerCase(),
						})));

						//reselect saved if returning to page
						if(sessionStorage.getItem("people")){
							var people = JSON.parse(sessionStorage.getItem("people"));
							$.each(people, function(index, person){
								if(person.name.formatted.toLowerCase() == sorted[i].toLowerCase()){
									$('#whoContactWrap'+i).addClass('whoContactWrap');
									var height = $('#whoContactWrap'+i).height() - 2;
									$('#whoContactWrap'+i).height(height);
									var padding = Number($('#whoContact'+i).css("padding-top").split("p")[0]);
									$('#whoContact'+i).css("padding-top", (padding-1)+"px");
									return;
								}
							});
						}
							
						//set click toggle
						$('#whoContact'+i).click(function(){
							//if unselecting
							if($('#whoContactWrap'+i).hasClass("whoContactWrap")){
								$('#whoContactWrap'+i).removeClass('whoContactWrap');
								var height = $('#whoContactWrap'+i).height() + 2;
								$('#whoContactWrap'+i).height(height);
								var padding = $('#whoContact'+i).css("padding-top");
								$('#whoContact'+i).css("padding-top", (padding+1)+"px");
							}
							//if selecting
							else{
								$('#whoContactWrap'+i).addClass('whoContactWrap');
								var height = $('#whoContactWrap'+i).height() - 2;
								$('#whoContactWrap'+i).height(height);
								$('#whoContact'+i).css("padding-top", "9px");
								//if 'start' not yet visible, display
								if($("#whoNextButton").css("display") == "none"){
									var top = $("#whoContent").position().top;
									$("#whoContent").animate({'top': top - 30 }, 500);
									$("#whoNextButton").css('display', "block");
									$("#whoNextButton").animate({'opacity': "1" }, 500);
								}
							}
							$("#whoScroll").trigger("create");
						}); 
					}); //end each
					$("#whoContent").css('top', ($(window).height()/2)-($("#whoContent").height()/2) );
					
				}
				//else if no contact, notify 
				else{
					$("#whoScroll").append($("<p/>",{
						'text':'no contacts found - empty',
						'style':'color:white;',
					}));
				}
			}
			//else if no contact, notify 
			else{
				$("#whoScroll").append($("<p/>",{
					'text':'no contacts found - length',
					'style':'color:white;',
				}));
			}
		}, function(e){
			console.log(e);
			$("#whoScroll").append($("<p/>",{
				'text':'no contacts found - navigator',
				'style':'color:white;',
			}));
		}, options);
	}
	catch(e){
		console.log("caught: no contacts option (emu?)");
		$("#whoScroll").append($("<p/>",{
			'text':'no contacts found - desktop?',
			'style':'color:white;',
		}));
	}

	$("#whoContent").css('top', ($(window).height()/2)-($("#whoContent").height()/2) );
	var maxWidth = $('#whoContactWrap').width()-2;
	$('.whoContactWrap').css("max-width", maxWidth+"px");
	$("#whoContent").trigger("create");

	//display
	$("#whoContent").css("visibility", "visible");

	//scroll
	var scrollHeight = $("#whoScroll").scrollHeight;
	$("#whoScroll").animate({ scrollTop: $('#whoScroll')[0].scrollHeight}, 0);
	$("#whoScroll").animate({ scrollTop: 0}, 1000);
}
