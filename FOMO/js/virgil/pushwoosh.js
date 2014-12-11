

/* Initializes PushWoosh for Android. */
function initPushwoosh() {
    if(/android/i.test(navigator.userAgent.toLowerCase()))
    {
        registerPushwooshAndroid();
    }

    if(/iphone|ipod|ipad|ios/i.test(navigator.userAgent.toLowerCase()))
    {
        registerPushwooshIOS();
    }
}


function sendPushNotification(pushContent){
    $.ajax({
        type: "post", 
        url: 'https://cp.pushwoosh.com/json/1.3/createMessage',
        data: 
        '{"request": {"application":"BD25D-34515","auth":"MkfR7dpMNtILmpaOlgdwuPB0dGnZNjrVPSi7I52GnLVIoKJ5rarTq7TuMs5TDylD33BP9HTQYoktjhuGAVpT","notifications": [{"send_date":"now","content": "'+pushContent+'"}]}}',
        dataType: "json",
        success: function(response) {   
            //push sent
            console.log("sendPushNotification() Succeeded!");
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.log("sendPushNotification() Failed!");
            console.log(error);
        }
    });
}
