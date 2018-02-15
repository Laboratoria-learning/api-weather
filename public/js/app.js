function staggerFade() {
	setTimeout(function() {
		$('.fadein-stagger > *').each(function() {
			$(this).addClass('js-animated');
		})
	}, 30);
}

// Skycons(icons de api)
function skycons() {
	var i,
  icons = new Skycons({
    "color" : "rgb(230, 222, 222)",
    "resizeClear": true 
  }),
  list  = [ 
    "clear-day",
    "clear-night",
    "partly-cloudy-day",
    "partly-cloudy-night",
    "cloudy",
    "rain",
    "sleet",
    "snow",
    "wind",
    "fog"
  ];

	// recorrer la lista de iconos
	for(i = list.length; i--;) {
		var weatherType = list[i], 
			elements    = document.getElementsByClassName( weatherType );
		for (e = elements.length; e--;) {
			icons.set(elements[e], weatherType);
		}
	}
	// animate icons
	icons.play();
}

// convertir temperatura en celcius
function fToC(fahrenheit) {
	var fTemp  = fahrenheit,
		fToCel = (fTemp - 32) * 5 / 9;
	return fToCel;
}

// Weather Reporte
function weatherReport(latitude, longitude) {
	var apiKey       = 'f42e201c886a8677acb434cbe722cb51',
			url          = 'https://api.darksky.net/forecast/',
			lati         = latitude,
			longi        = longitude,
			api_call     = url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

	// referencia  de los dias de la semana
	var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	var sunday    = [],
			monday    = [],
			tuesday   = [],
			wednesday = [],
			thursday  = [],
			friday    = [],
			saturday  = [];

	var isCelsiusChecked = $('#celsius:checked').length > 0;

	function hourlyReport(day, selector) {
		for(var i = 0, l = day.length; i < l; i++) {
			$("." + selector + " " + "ul").append('<li>' + Math.round(day[i]) + '</li>');
		}
  }

	$.getJSON(api_call, function(forecast) {

		// los proonosticos por dias
		for(var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {

			var date     = new Date(forecast.daily.data[i].time * 1000),
					day      = days[date.getDay()],
					skicons  = forecast.daily.data[i].icon,
					time     = forecast.daily.data[i].time,
					humidity = Math.round(forecast.daily.data[i].humidity*100),
					summary  = forecast.daily.data[i].summary,
					temp    = Math.round(forecast.hourly.data[i].temperature),
					tempMax = Math.round(forecast.daily.data[i].temperatureMax);
			if(isCelsiusChecked) {
				temp    = fToC(temp);
				tempMax = fToC(tempMax);
				temp = Math.round(temp);
				tempMax = Math.round(tempMax);
			}

			// Agregando datos para cada dia de la semana
      $("#forecast").append(
				'<li class=" center shade-'+  skicons +'"><div><div><div class="front card"><div>' +
					"<div class='graphic'><h3 class='center'>"+ day + "</h3><br><canvas class=" + skicons + "></canvas></div>" +
					"<br><div><b>Day</b>:&nbsp&nbsp&nbsp&nbsp&nbsp " + date.toLocaleDateString() + "</div>" +
					"<div><b>Temperature</b>:&nbsp&nbsp&nbsp&nbsp&nbsp " + temp  + 'C'+'&#176'+"</div>" +
					"<div><b>Max Temp.</b>:&nbsp&nbsp&nbsp&nbsp&nbsp " + tempMax + 'C'+'&#176'+"</div>" +
					"<div><b>Humidity</b>:&nbsp&nbsp&nbsp&nbsp&nbsp " + humidity + '%' +"</div>" +
					'<p class="summary">' + summary + '</p>' +
					'</div></div><div class="back card"></div></div></div></li>'
      );
			switch(day) {
				case 'Sunday':
					hourlyReport(sunday, days[0]);
					break;
				case 'Monday':
					hourlyReport(monday, days[1]);
					break;
				case 'Tuesday':
					hourlyReport(tuesday, days[2]);
					break;
				case 'Wednesday':
					hourlyReport(wednesday, days[3]);
					break;
				case 'Thursday':
					hourlyReport(thursday, days[4]);
					break;
				case 'Friday':
					hourlyReport(friday, days[5]);
					break;
				case 'Saturday':
					hourlyReport(saturday, days[6]);
					break;
			}
    }
     
    // Agregando datos para el dia en curso

    $("#forecastWeek").append(
      '<div class="center shade-'+ forecast.daily.data[0].icon +'"><div"><div><div class="front card"><div>' + "<div class='graphic'><h3 class='center'>"+ day + "</h3><br><br><canvas class=" + forecast.daily.data[0].icon +"></canvas></div><br><div><b>Day</b>: &nbsp&nbsp&nbsp&nbsp&nbsp " + new Date(forecast.daily.data[0].time * 1000).toLocaleDateString() + "</div>" + "<div><b>Temperature</b>: &nbsp&nbsp&nbsp&nbsp&nbsp" + Math.round(forecast.hourly.data[0].temperature)+'C'+'&#176' + "</div>" +
      "<div><b>Max Temp.</b>: &nbsp&nbsp&nbsp&nbsp&nbsp" + Math.round(forecast.daily.data[0].temperatureMax) + 'C'+'&#176'+ "</div>" +
      "<div><b>Humidity</b>: &nbsp&nbsp&nbsp&nbsp&nbsp" + Math.round(forecast.daily.data[0].humidity*100) +'%' + "</div>" +
      '<p class="summary">' + forecast.daily.data[0].summary + '</p>' +
      '</div></div><div class="back card"></div></div></div></div>'
    );

		skycons();
		staggerFade();
	});
}


// eventos de buttons
$('button').on('click', function(e) {
	var lat       = $('#latitude').val(),
			long      = $('#longitude').val(),
			city_name = $('#city-search').val()

	if(lat && long !== '') {
		e.preventDefault();
		$('.form').fadeOut(100, function() {
			weatherReport(lat, long);
			$('.screen').append('<h3 class="city">' + city_name + '</h3><button id="back">New Forecast</button><button id="next">Predictions of the Week</button><div id="forecastWeek"></div>');
		});
	}
});

$('body').on('click','#next', function(e) {
	var lat       = $('#latitude').val(),
			long      = $('#longitude').val(),
			city_name = $('#city-search').val()

	if(lat && long !== '') {
		e.preventDefault();
		$('#forecastWeek').fadeOut(100, function() {
      weatherReport(lat, long);
			$('.screen').append('<ul class="list-reset fadein-stagger" id="forecast"></ul>');
		});
	}
});

$('body').on('click', '#back', function() {
	window.location.reload(true);
})


// Api Google maps

function insertGoogleScript() {
	var google_api = document.createElement('script'),
			api_key    = 'AIzaSyAnhhd9cMSlPq7sss2LM2TNnp5JiTcx78s';
	google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=initGoogleAPI&libraries=places,geometry';
	document.body.appendChild(google_api);
}


// SearchBox Method
function initGoogleAPI() {
	var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city-search"));

	autocomplete.addListener('places_changed', function() {
		var place = autocomplete.getPlaces()[0];
		document.querySelector("#latitude").value = place.geometry.location.lat();
		document.querySelector("#longitude").value = place.geometry.location.lng();
	});
}

insertGoogleScript();

