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
    "color" : "#FFFFFF",
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
  
  // Pronosticos por horas
	$.getJSON(api_call, function(forecast) {
		for(var j = 0, k = forecast.hourly.data.length; j < k; j++) {
			var hourly_date    = new Date(forecast.hourly.data[j].time * 1000),
					hourly_day     = days[hourly_date.getDay()],
					hourly_temp    = forecast.hourly.data[j].temperature;
			if(isCelsiusChecked) {
				hourly_temp = fToC(hourly_temp);
				hourly_temp = Math.round((hourly_temp));
			}

			// agregamos los pronosticos ppor hora a las matrices vacias
			switch(hourly_day) {
				case 'Sunday':
					sunday.push(hourly_temp);
					break;
				case 'Monday':
					monday.push(hourly_temp);
					break;
				case 'Tuesday':
					tuesday.push(hourly_temp);
					break;
				case 'Wednesday':
					wednesday.push(hourly_temp);
					break;
				case 'Thursday':
					thursday.push(hourly_temp);
					break;
				case 'Friday':
					friday.push(hourly_temp);
					break;
				case 'Saturday':
					saturday.push(hourly_temp);
					break;
				default: console.log(hourly_date.toLocaleTimeString());
					break;
			}
		}

		// los proonosticos por dias
		for(var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {

			var date     = new Date(forecast.daily.data[i].time * 1000),
					day      = days[date.getDay()],
					skicons  = forecast.daily.data[i].icon,
					time     = forecast.daily.data[i].time,
					humidity = forecast.daily.data[i].humidity,
					summary  = forecast.daily.data[i].summary,
					temp    = Math.round(forecast.hourly.data[i].temperature),
					tempMax = Math.round(forecast.daily.data[i].temperatureMax);
			if(isCelsiusChecked) {
				temp    = fToC(temp);
				tempMax = fToC(tempMax);
				temp = Math.round(temp);
				tempMax = Math.round(tempMax);
			}

			// Append Markup for each Forecast of the 7 day week
			$("#forecast").append(
				'<li class="shade-'+ skicons +'"><div class="card-container"><div><div class="front card"><div>' +
					"<div class='graphic'><div>"+ day + "</div><canvas class=" + skicons + "></canvas></div>" +
					"<div><b>Day</b>: " + date.toLocaleDateString() + "</div>" +
					"<div><b>Temperature</b>: " + temp + "</div>" +
					"<div><b>Max Temp.</b>: " + tempMax + "</div>" +
					"<div><b>Humidity</b>: " + humidity + "</div>" +
					'<p class="summary">' + summary + '</p>' +
					'</div></div><div class="back card">' +
					'<div class="hourly' + ' ' + day + '"></div></div></div></div></li>'
			);

			// Daily forecast report for each day of the week
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

		skycons(); // inject skycons for each forecast
		staggerFade(); // fade-in forecast cards in a stagger-esque fashion

	});
}
