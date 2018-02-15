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
