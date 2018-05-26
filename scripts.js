//Check for browser geolocation abilities
if (navigator.geolocation) {
  //Get latitude, longitude, accuracy, and timestamp
  navigator.geolocation.getCurrentPosition(function(position) {

    // question!!!
    // https://stackoverflow.com/questions/28592859/geolocation-javascript-scope-issue
    let latitudeMeasurement = position.coords.latitude;
    let longitudeMeasurement = position.coords.longitude;

    let ts = document.querySelector('#timestamp');
    let timeStamp = new Date(position.timestamp);
    ts.textContent = "Updated: " + timeStamp.toLocaleString();

    //make API call for weather data
    //remove let/var to make it a globally accessible variable
    request = new XMLHttpRequest();
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitudeMeasurement}&lon=${longitudeMeasurement}&units=imperial&appid=b056e3da825f49292fe0d4b5f8f8d9b3`;

    request.onreadystatechange = function() {
      console.log("ready state " + this.readyState);
      console.log("status " + this.status);
      // console.log(this.responseText);
      // https://stackoverflow.com/questions/46891615/unexpected-end-of-json-input-although-response-was-received
      if (this.readyState === 4 && this.status === 200)  {
        //you can't accurately move to find the data without parsing the response because the computer thinks it's one long string
        // take off var/let to make response a global variable and accessible anywhere
        response = JSON.parse(this.responseText);
        console.log("cod " + response.cod);
        //log unparsed response
        //console.log(request.responseText);

        //log parsed response
        console.log(response);

        displayLatLon();
        displayAndSwitchTempUnit();
        displayIcon();
        displayCityCountry();
        changeBackground();
        searchLocation();
        hideWeatherCard();


        // get current local time of the user's computer
        //THX: http://www.javascriptkit.com/dhtmltutors/local-time-google-time-zone-api.shtml

        let targetDate = new Date();
        let unixTimeStamp = Math.floor((new Date()).getTime() / 1000);
        let apiTimeStamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset()*60;

        //use google maps time zone api to get time zone data for sunrise sunset
        let timeZoneRequest = new XMLHttpRequest();
        let timeZoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${response.coord.lat},${response.coord.lon}&timestamp=${apiTimeStamp}&key=AIzaSyAhMp5Ew5OZ0h0MfxbM5TFV_NAMp11xP0k`
        timeZoneRequest.open("GET", timeZoneUrl, true);

        timeZoneRequest.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
            //you can't accurately move to find the data without parsing the response because the computer thinks it's one long string
            let timeZoneResponse = JSON.parse(this.responseText);
            console.log(timeZoneResponse);

            let offsets = timeZoneResponse.dstOffset * 1000 + timeZoneResponse.rawOffset * 1000;
            let localDate = new Date(apiTimeStamp * 1000 + offsets);
            let localDateDisplay = document.querySelector('#localTime');
            localDateDisplay.innerHTML = "Local Date + Time:<br>" + localDate.toLocaleString();

            let tz = timeZoneResponse.timeZoneId;

            let sunrise = response.sys.sunrise;
            let JSsunrise = new Date(sunrise * 1000);
            let sunriseDisplay = document.querySelector('#sunrise');
            sunriseDisplay.textContent = "Sunrise: " + JSsunrise.toLocaleTimeString('en-US', { timeZone: [tz] });

            let sunset = response.sys.sunset;
            let JSsunset = new Date(sunset * 1000);
            let sunsetDisplay = document.querySelector('#sunset');
            sunsetDisplay.textContent = "Sunset: " + JSsunset.toLocaleTimeString('en-US', { timeZone: [tz] });
          }
        }
        timeZoneRequest.send();
      }
      // else if (response.coord.lat != 200 || response.coord.lon != 200) {
        // window.addEventListener('error', function(e) {
        //    alert("Something went wrong, please try again");
        // }, true);
      //   window.onerror = function(msg, url, linenumber) {
      //    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
      //    return true;
      // }
      //   setTimeout(function() { alert(request.statusText); }, 1000);
      // }
    };

    request.open("GET", url, true);
    request.send();



    //callback function for what the browser should do if geolocation cannot work or is denied
  }, function(error) {
    alert("If you want local weather and sunset/sunrise times or to search for this data in other locations, you'll have to allow sharing of your position. If you only want local weather then just look outside :).");
  });
};


// ------ FUNCTIONS ------ //

function displayUpdateTimestamp() {

}

function displayLatLon() {
  let latText = document.querySelector('#latitude');
  let lonText = document.querySelector('#longitude');
  latText.textContent = "Latitude: " + response.coord.lat;
  lonText.textContent = "Longitude: " + response.coord.lon;
}

function displayIcon() {
  let iconDisplay = document.querySelector('#icon-js');
  let icon = response.weather[0].icon;
  let iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
  iconDisplay.setAttribute("src", iconUrl);
  iconDisplay.style.height = '80px';
  iconDisplay.style.width = '80px';
}

function displayCityCountry() {
  //display the location
  let cityDisplay = document.querySelector('#cityDisplay');
  cityDisplay.textContent = response.name + ",";

  //display the country
  let country = document.querySelector('#country');
  country.textContent = response.sys.country;
}

function displayAndSwitchTempUnit() {
  //Variables
  let tempDisplay = document.querySelector('#temp');
  let tempFahrenheit = Math.round(response.main.temp);
  let tempCelsius = Math.round((tempFahrenheit -32) * 5/9);
  //Display
  //info on javascript escapes here: https://mathiasbynens.be/notes/javascript-escapes
  tempDisplay.textContent = tempFahrenheit + " \xb0F";

  //change to celsius and back to fahrenheit if C or F is clicked
  let celsius = document.querySelector('#celsius');
  let fahrenheit = document.querySelector('#fahrenheit');

  celsius.addEventListener('click', function() {
    tempDisplay.textContent = tempCelsius + " \xb0C";
    // celsius.style.background = 'rgba(255, 255, 255, 0.6)';
    // fahrenheit.style.background = 'transparent';
    fahrenheit.classList.remove("active");
    celsius.classList.add("active");
  });

  fahrenheit.addEventListener('click', function() {
    tempDisplay.textContent = tempFahrenheit + " \xb0F";
    // fahrenheit.style.background = 'rgba(255, 255, 255, 0.6)';
    // celsius.style.background = 'transparent';
    celsius.classList.remove("active");
    fahrenheit.classList.add("active");
  });
};

function changeBackground() {
  let weather = response.weather[0].main;
  let icon = response.weather[0].icon;
  console.log(weather);

  //switch statement to read the main weather data received and respond with the right gradient(s)
  switch (weather) {
    case 'Thunderstorm':
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #283048, #859398)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #283048, #859398)";
      }
      break;
    case 'Drizzle':
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #4ca1af, #c4e0e5)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #4ca1af, #c4e0e5)";
      }
      break;
    case 'Rain':
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)";
      }
      break;
    case 'Snow':
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #e6dada, #274046)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #e6dada, #274046)";
      }
      break;
    case 'Atmosphere':
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #3e5151, #decba4)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #3e5151, #decba4)";
      }
      break;
    case 'Clear':
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #1c92d2, #f2fcfe)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #1c92d2, #f2fcfe)";
      }
      break;
    case 'Clouds':
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #e2dfdc, #ffffff)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #e2dfdc, #ffffff)";
      }
      break;
    case 'Hazy':
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #e2dfdc, #ffffff)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #e2dfdc, #ffffff)";
      }
      break;
    case 'Extreme':
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #40e0d0, #ff8c00, #ff0080)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #40e0d0, #ff8c00, #ff0080)";
      }
      break;
    default:
      if (icon.includes('d')) {
        document.body.style.background = "linear-gradient(to right, #E9E4F0, #D3CCE3)";
      } else {
        document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #E9E4F0, #D3CCE3)";
      }
  }
};

function searchLocation() {
  //behavior on clicking Go button
  let go = document.querySelector('#search');
  let cityInput = document.querySelector('#city');

  //grab input value on click
  go.addEventListener("click", function() {
    let city = cityInput.value;
    let cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b056e3da825f49292fe0d4b5f8f8d9b3`;
    console.log(city);
    //request means it is calling the original openweather api call
    request.open("GET", cityUrl, true);
    request.send();
  });

  //grab input value on pressing enter
  cityInput.addEventListener("keydown", function(e) {
    //console.log(e.keyCode);
    if (e.keyCode === 13) {
      let city = cityInput.value;
      let cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b056e3da825f49292fe0d4b5f8f8d9b3`;
      console.log(city);
      //request means it is calling the original openweather api call
      request.open("GET", cityUrl, true);
      request.send();
    }
  });
}

function hideWeatherCard() {
  //if info menu is toggled, then hide weather card
  let weatherCard = document.querySelector('.card');
  let menu = document.querySelector('#menu');

  menu.addEventListener('click', function() {
    if (menu.checked) {
      console.log(menu.checked);
      weatherCard.style.display = "none";
    } else {
      console.log(menu.checked);
      weatherCard.style.display = "block";
    };
  });
};
