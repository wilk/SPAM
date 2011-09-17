function get_position(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(successcallback, errorcallback);
	}
	else{
		alert('Geolocalization is not supported');
	}
}

function successcallback(position){

	coords=[position.coords.latitude,position.coords.longitude];
	return coords;

}

function errorcallback(code, message){

	switch(code){
	
		case 0:
			alert('unknown error');
			break;
		case 1:
			alert('permission denied');
			break;
		case 2:
			alert('position unavailable');
			break;
		case 3:
			alert('timeout');
			break;
	
	}

}
