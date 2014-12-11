
//var servicesAPI = 'https://antriss.com/voxeo/services/';
var servicesAPI = 'https://antriss.com/dev/services/';
var registerConnect = servicesAPI + 'antris_register.php';
var loginConnect = servicesAPI + 'antris_checkpin2.php';
var sendMessageConnect = servicesAPI + 'antris_sendMessage.php';

function register(){
	var fname = $("#signupFirstName").val();
	var lname = $("#signupLastName").val();
	var email = $("#signupEmail").val();
	var password = "Antris999";
	var confirm_password = "Antris999";
	var pin = $("#signupPIN").val();
	var confirm_pin = $("#signupPINConfirm").val();
	var telephone = $("#signupTelephone").val();
	telephone = telephone.replace(/\W/g, '');
	$.ajax({
		type: "post", 
		url: registerConnect,
		data: {"fname":fname, "lname":lname, "telephone":telephone, "email":email, "password":password, "confirm_password":confirm_password, "pin":pin, "confirm_pin":confirm_pin},
		dataType: "json",
		success: function(response) {	
			if(response.result == "1"){
				$.mobile.changePage("#wherePage", {
					transition: 'slide'
				});
			}
			else{
				$("#signupError").text(response.message.substring(0,response.message.length-1).toLowerCase());
				$("#signupError").show(500);
			}
		},
		error: function(xhr, status, error){
			console.log("register() failed: " + error);
			$("#signupError").text("signup timed out");
			$("#signupError").show(500);
		}
	});
}

function login(){
	var telephone = $("#signinTelephone").val();
	telephone = telephone.replace(/\W/g, '');
	var pin = $("#signinPIN").val();
	$.ajax({
		type: "post", 
		url: loginConnect,
		data: {"telephone":telephone, "pin":pin},
		dataType: "json",
		success: function(response) {	
			//begin questions
			if(response.memberid != "s0" && response.memberid != "0" && response.memberid != "p0"){
				sessionStorage.setItem("memberid", response.memberid);
				$.mobile.changePage("#wherePage", {
					transition: 'slide'
				});
			}
			else{
				$("#signinError").text(telephone);
				$("#signinContent").animate({'top':$("#signinContent").position().top - 60}, 500);
				$("#signinError").show(500);
			}
		},
		error: function(xhr, status, error){
			console.log("register() failed: " + error);
		}
	});
}

/* Sends a specified message to or on behalf of a specified member.
 * @param memberid The ID of the member to who the message is being sent on behalf of.
 * @param people The people to contact on behalf of the member.
 * @param messageid The ID of the message to be sent. 
 */
 function sendMessage(messageid){
 	//get memberid
	var memberid = sessionStorage.getItem("memberid");
	//get people
	var people = JSON.parse(sessionStorage.getItem("people"));
	$.ajax({
		type: "post", 
		url: sendMessageConnect,
		data: {"member_id":memberid, "people": people, "message_id":messageid},
		dataType: "json",
		success: function(response) {	
			if(response.result == 1){
				console.log("sendMessage() Success!");
			}
			else{
				console.log("sendMessage() Returned 0!");
			}
		},
		error: function(xhr, status, error) {
			console.log("sendMessage() Failed! ");
		}
	}); 
}