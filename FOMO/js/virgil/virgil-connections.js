//var virgilServicesAPI = 'https://antriss.com/voxeo/services/';
var virgilServicesAPI = 'https://antriss.com/dev/services/';
var reportLocationConnect = servicesAPI + 'antris_savegis.php';

/* Reports the User's location to Server. 
 * @param location Location object returned by navigator.geolocation.getCurrentPosition
 */
function reportLocation(location){
	var memberid = sessionStorage.getItem("memberid");
	var lat = location.coords.latitude;
	var lng = location.coords.longitude;
	var alt = location.coords.altitude;
	$.ajax({
		type: "post", 
		url: reportLocationConnect,
		data: {"memberid":memberid, "lat":lat, "lng":lng, "alt":alt},
		dataType: "json",
		success: function(response) {	
			//success
			console.log("location reported");
		},
		error: function(xhr, status, error){
			console.log("reportLocation() failed: " + error);
		}
	});
}