var rocky = require('rocky');

var weather;

//layout for drawings
var layout = {'textalign': 'center', 'timefont':'20px Gothic','datefont':'20px Gothic','font': '20px Gothic','color': 'white','backgroundcolor': 'black'};

rocky.on('message',function(event){
	//get message from mobile device
	var message = event.data;
	
	//if message contains weather
	if(message.weather){
		weather = message.weather;
		rocky.requestDraw();
	}
	
});

rocky.on('hourchange',function(event){
	rocky.postMessage({'fetch':true});
});

rocky.on('minutechange',function(event){
	
	rocky.requestDraw();
});

rocky.on('draw',function(event){
		
	//get CanvasRenderingContext2D
	var context = event.context;
	
	//clear (refresh screen)
	context.clearRect(0,0,context.canvas.clientWidth,context.canvas.clientHeight);
	
	//draw weather
	if(weather){
		drawWeather(context,weather);
	}else{
		console.log('No weather to be found');
		context.fillText('No weather to show :(',context.canvas.unobstructedWidth/2,2);
	}
	
	//draw time!
	drawTime(context);
	
});

function drawTime(context){
		
	var datetime = new Date();
  var dispWidth = context.canvas.unobstructedWidth;
	var dispHeight = context.canvas.unobstructedHeight;
	
	context.fillStyle = layout.color;
	context.textAlign = layout.textalign;
	context.font = layout.timefont;
	var timeStr = datetime.getHours()+':'+(datetime.getMinutes() < 10 ? '0' : '')+datetime.getMinutes();
	var dateStr = (datetime.getMonth()+1)+'/'+datetime.getDate()+'/'+datetime.getFullYear();
	context.fillText(timeStr,dispWidth/2,dispHeight/3,dispWidth);
	
	context.font = layout.datefont;
	context.fillText(dateStr,dispWidth/2,3*dispHeight/5,dispWidth);
	
}

function drawWeather(context,weather){
	var weatherStr = weather.celsius + 'ºC, ' + weather.desc;
	
	context.textAlign = layout.textalign;
	context.fillStyle = layout.color;
	context.font = layout.font;
	context.fillText(weatherStr,context.canvas.unobstructedWidth/2,context.canvas.unobstructedHeight/5);
}