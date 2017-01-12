var weatherAPIkey = '60ef307eea14c89484d6650b233e44f2';



Pebble.on('message',function(event){
	var message = event.data;
	
	//if message contains a fetch obj, then the watch is asking for the weather!
	if(message.fetch) {
		
		//try to get get current position and pass it to this function
		navigator.geolocation.getCurrentPosition(function(pos){
		var weatherURL = 'http://api.openweathermap.org/data/2.5/weather' +
								'?lat=' + pos.coords.latitude +
								'&lon=' + pos.coords.longitude +
								'&appid=' + weatherAPIkey;
			console.log('weatherUrl: '+ weatherURL);
			
		request(weatherURL,'GET',function(respText){
			
			console.log('response text: '+respText);
			var weatherData = JSON.parse(respText);
			
			Pebble.postMessage({
    'weather': {
      // Convert from Kelvin
      'celsius': Math.round(weatherData.main.temp - 273.15),
      'fahrenheit': Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32),
      'desc': weatherData.weather[0].main
    }
  });
			
		});
			
		},function(err){//but also be ready to fail!
			
			console.error('Error getting location');
		},{timeout: 15000, maximumAge: 60000}); //also, set the timeout time for a response from the watch and a maximumage for the location
	}
	
});

function request(url,type,callback){
	var xhr = new XMLHttpRequest();
	xhr.onload = function(e){
		if (xhr.status >= 400 && xhr.status < 600) {
      console.error('Request failed with HTTP status ' + xhr.status + ', body: ' + this.responseText);
      return;
    }
		//run callback with
		callback(this.responseText);
	};
	
	//initialize request of type to url
	xhr.open(type,url);
	//send off the request!
	xhr.send();
}

