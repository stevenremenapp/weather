//Check for browser geolocation abilities
if (navigator.geolocation) {
  //Get latitude, longitude, accuracy, and timestamp
  navigator.geolocation.getCurrentPosition(function(position) {
    let latText = document.querySelector('#latitude');
    let lonText = document.querySelector('#longitude');
    let acc = document.querySelector('#accuracy');
    let ts = document.querySelector('#timestamp');
    let latitudeMeasurement = position.coords.latitude;
    let longitudeMeasurement = position.coords.longitude;

    latText.textContent = "Latitude: " + latitudeMeasurement;
    lonText.textContent = "Longitude: " + longitudeMeasurement;
    acc.textContent = "Accuracy: " + position.coords.accuracy + " m";
    let timeStamp = new Date(position.timestamp);
    ts.textContent = "Updated: " + timeStamp.toLocaleString();

    //make API call for weather data
    let request = new XMLHttpRequest();
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitudeMeasurement}&lon=${longitudeMeasurement}&units=imperial&appid=b056e3da825f49292fe0d4b5f8f8d9b3`;

    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        //you can't accurately move to find the data without parsing the response because the computer thinks it's one long string
        let response = JSON.parse(this.responseText);
        //log unparsed response
        //console.log(request.responseText);

        //log parsed response
        console.log(response);

        //display the temperature
        let tempDisplay = document.querySelector('#temp');
        //info on javascript escapes here: https://mathiasbynens.be/notes/javascript-escapes
        tempDisplay.textContent = response.main.temp + " \xb0F";

        //display the icon
        let iconDisplay = document.querySelector('#icon-js');
        let icon = response.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
        iconDisplay.setAttribute("src", iconUrl);
        iconDisplay.style.height = '100px';
        iconDisplay.style.width = '100px';
        //iconDisplay.src = iconUrl;

        //change the background gradient based on response.weather[0].main
        let weather = response.weather[0].main;
        console.log(weather);

        //if it is nighttime add an additional gradient to darken the screen
        //Use the JavaScript Date Object to get the current time of day and convert it to Unix timestamp. JS gets time in ms, so convert to secs for Unix
        let unixTimeStamp = Math.floor(Date.now() / 1000);
        console.log(response.sys.sunrise);
        console.log(unixTimeStamp);
        console.log(response.sys.sunset);


        switch (weather) {
          case 'Thunderstorm':
            if (unixTimeStamp > response.sys.sunrise && unixTimeStamp < response.sys.sunset) {
              document.body.style.background = "linear-gradient(to right, #283048, #859398)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #283048, #859398)";
            }
            break;
          case 'Drizzle':
            if (unixTimeStamp > response.sys.sunrise && unixTimeStamp < response.sys.sunset) {
              document.body.style.background = "linear-gradient(to right, #4ca1af, #c4e0e5)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #4ca1af, #c4e0e5)";
            }
            break;
          case 'Rain':
            if (unixTimeStamp > response.sys.sunrise && unixTimeStamp < response.sys.sunset) {
              document.body.style.background = "linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)";
            }
            break;
          case 'Snow':
            if (unixTimeStamp > response.sys.sunrise && unixTimeStamp < response.sys.sunset) {
              document.body.style.background = "linear-gradient(to right, #e6dada, #274046)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #e6dada, #274046)";
            }
            break;
          case 'Atmosphere':
            if (unixTimeStamp > response.sys.sunrise && unixTimeStamp < response.sys.sunset) {
              document.body.style.background = "linear-gradient(to right, #3e5151, #decba4)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #3e5151, #decba4)";
            }
            break;
          case 'Clear':
            if (unixTimeStamp > response.sys.sunrise && unixTimeStamp < response.sys.sunset) {
              document.body.style.background = "linear-gradient(to right, #1c92d2, #f2fcfe)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #1c92d2, #f2fcfe)";
            }
            break;
          case 'Clouds':
            if (unixTimeStamp > response.sys.sunrise && unixTimeStamp < response.sys.sunset) {
              document.body.style.background = "linear-gradient(to right, #e2dfdc, #ffffff)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #e2dfdc, #ffffff)";
            }
            break;
          case 'Extreme':
            if (unixTimeStamp > response.sys.sunrise && unixTimeStamp < response.sys.sunset) {
              document.body.style.background = "linear-gradient(to right, #40e0d0, #ff8c00, #ff0080)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #40e0d0, #ff8c00, #ff0080)";
            }
            break;
          default:
            if (unixTimeStamp > response.sys.sunrise && unixTimeStamp < response.sys.sunset) {
              document.body.style.background = "linear-gradient(to right, #E9E4F0, #D3CCE3)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #E9E4F0, #D3CCE3)";
            }
        }

        //display the location
        let location = document.querySelector('#location');
        location.textContent = response.name + ",";

        //display the country
        let country = document.querySelector('#country');
        country.textContent = response.sys.country;
      }
    }

    request.open("GET", url, true);
    request.send();

  });
};
