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
    ts.textContent = "Time: " + timeStamp.toLocaleString();

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
        tempDisplay.textContent = "Temperature: " + response.main.temp + " F\xb0";

        //display the icon
        let iconDisplay = document.querySelector('#icon-js');
        let icon = response.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
        iconDisplay.setAttribute("src", iconUrl);
        //iconDisplay.src = iconUrl;

        //display the location
        let location = document.querySelector('#location');
        location.textContent = "Location: " + response.name + ",";

        //display the country
        let country = document.querySelector('#country');
        country.textContent = response.sys.country;
      }
    }

    request.open("GET", url, true);
    request.send();

  });
};
