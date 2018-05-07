//Check for browser geolocation abilities
if (navigator.geolocation) {
  //Get latitude, longitude, accuracy, and timestamp
  navigator.geolocation.getCurrentPosition(function(position) {

    //let acc = document.querySelector('#accuracy');
    let ts = document.querySelector('#timestamp');
    let latitudeMeasurement = position.coords.latitude;
    let longitudeMeasurement = position.coords.longitude;

    //acc.textContent = "Accuracy: " + Math.round(position.coords.accuracy) + " m";
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


        let latText = document.querySelector('#latitude');
        let lonText = document.querySelector('#longitude');
        latText.textContent = "Latitude: " + response.coord.lat;
        lonText.textContent = "Longitude: " + response.coord.lon;

        //display the temperature
        let tempDisplay = document.querySelector('#temp');
        //info on javascript escapes here: https://mathiasbynens.be/notes/javascript-escapes
        let tempFahrenheit = Math.round(response.main.temp);
        let tempCelsius = Math.round((tempFahrenheit -32) * 5/9);
        tempDisplay.textContent = tempFahrenheit + " \xb0F";
        console.log(response.main.temp);
        console.log(tempFahrenheit);
        console.log(tempCelsius);

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
        })

        //display the icon
        let iconDisplay = document.querySelector('#icon-js');
        let icon = response.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
        iconDisplay.setAttribute("src", iconUrl);
        iconDisplay.style.height = '80px';
        iconDisplay.style.width = '80px';
        //iconDisplay.src = iconUrl;


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
            console.log(timeZoneResponse.status);
            console.log(timeZoneResponse);

            let offsets = timeZoneResponse.dstOffset * 1000 + timeZoneResponse.rawOffset * 1000;
            console.log(offsets);
            console.log(timeZoneResponse.dstOffset);
            let localDate = new Date(apiTimeStamp * 1000 + offsets);
            console.log(localDate.toLocaleString());
            let localDateDisplay = document.querySelector('#localTime');
            localDateDisplay.innerHTML = "Local Date + Time:<br>" + localDate.toLocaleString();

            //CONVERT UNIX SUNRISE & SUNSET TIMESTAMPS TO 24 HR READABLE TIME TO COMPARE THEM
            //NEED TO CONVERT SUNRISE AND SUNSET TIMES TO RIGHT TIME ZONE
            //convert sunrise UTC time to milliseconds for JS


            //let sunOffsets = timeZoneResponse.dstOffset + timeZoneResponse.rawOffset;
            //let sunriseDate = new Date();

            //let sunriseTimestamp = sunriseDate.getTime(sunrise)/1000 + (sunriseDate.getTimezoneOffset() * 60000);

            //let sunriseOffsets = timeZoneResponse.dstOffset * 1000 + timeZoneResponse.rawOffset * 1000;
            //let localSunriseDate = new Date(sunriseTimestamp * 1000 + offsets);

            // let machineDate = new Date(sunrise);
            // let machineOffset = machineDate.getTimezoneOffset()*60;
            // let sunriseOffsets = timeZoneResponse.dstOffset + timeZoneResponse.rawOffset;
            // let sunriseAdjusted = sunrise - machineOffset + (timeZoneResponse.rawOffset * 1000);
            // console.log(offsets);
            // console.log(machineOffset*1000);

            let sunrise = response.sys.sunrise;
            // let sunriseUTC = new Date(sunrise * 1000);
            // let sunsetUTC = new Date(sunset * 1000);
            let apiTimeStampUTC = new Date(apiTimeStamp * 1000);
            console.log(sunrise);
            // console.log(sunriseUTC);
            // console.log(sunriseUTC.getUTCHours());
            console.log(apiTimeStamp);
            // console.log(apiTimeStampUTC);
            // console.log(apiTimeStampUTC.getUTCHours());
            //console.log(sunset);
            // console.log(sunsetUTC);
            // console.log(sunsetUTC.getUTCHours());
            let JSsunrise = new Date(sunrise * 1000);
            let sunriseDisplay = document.querySelector('#sunrise');
            let tz = timeZoneResponse.timeZoneId;
            console.log(tz);
            sunriseDisplay.textContent = "Sunrise: " + JSsunrise.toLocaleTimeString('en-US', { timeZone: [tz] });
            console.log("JSsunrise: " + JSsunrise);
            console.log("Hours: " + JSsunrise.getHours());
            console.log("Minutes: " + JSsunrise.getMinutes());
            console.log("Seconds: " + JSsunrise.getSeconds());

            let sunset = response.sys.sunset;
            let JSsunset = new Date(sunset * 1000);
            let sunsetDisplay = document.querySelector('#sunset');
            sunsetDisplay.textContent = "Sunset: " + JSsunset.toLocaleTimeString('en-US', { timeZone: [tz] });
            console.log("JSsunset: " + JSsunset);
            console.log("Hours: " + JSsunset.getHours());
            console.log("Minutes: " + JSsunset.getMinutes());
            console.log("Seconds: " + JSsunset.getSeconds());

            console.log("Local Time: " + localDate);
            console.log("Hours: " + localDate.getHours());
            console.log("Minutes: " + localDate.getMinutes());
            console.log("Seconds: " + localDate.getSeconds());




            //console.log(timeZoneResponse.dstOffset);
            // let tzSunrise = response.sys.sunrise + timeZoneResponse.dstOffset + timeZoneResponse.rawOffset;
            // let localDate = new Date((response.sys.sunrise + timeZoneResponse.dstOffset + timeZoneResponse.rawOffset) * 1000);
            // console.log(localDate);

            // console.log(tzSunrise);
            // daylight(tzSunrise);
          }
        }
        timeZoneRequest.send();

        //if it is nighttime add an additional gradient to darken the screen
        //Use the JavaScript Date Object to get the current time of day and convert it to Unix timestamp. JS gets time in ms, so convert to secs for Unix




        // console.log("SR: " + response.sys.sunrise);
        // daylight(response.sys.sunrise);
        console.log("API: " + apiTimeStamp);
        console.log("JS Time: " + unixTimeStamp);
        // daylight(unixTimeStamp);
        // console.log("DT: " + response.dt);
        // daylight(response.dt);
        // console.log("SS: " + response.sys.sunset);
        // daylight(response.sys.sunset);


        //change the background gradient based on response.weather[0].main
        let weather = response.weather[0].main;
        console.log(weather);

        //switch statement to read the main weather data received and respond with the right gradient(s)
        switch (weather) {
          case 'Thunderstorm':
            if (icon === '11d') {
              document.body.style.background = "linear-gradient(to right, #283048, #859398)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #283048, #859398)";
            }
            break;
          case 'Drizzle':
            if (icon === '09d') {
              document.body.style.background = "linear-gradient(to right, #4ca1af, #c4e0e5)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #4ca1af, #c4e0e5)";
            }
            break;
          case 'Rain':
            if (icon === '10d') {
              document.body.style.background = "linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)";
            }
            break;
          case 'Snow':
            if (icon === '13d') {
              document.body.style.background = "linear-gradient(to right, #e6dada, #274046)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #e6dada, #274046)";
            }
            break;
          case 'Atmosphere':
            if (icon === '50d') {
              document.body.style.background = "linear-gradient(to right, #3e5151, #decba4)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #3e5151, #decba4)";
            }
            break;
          case 'Clear':
            if (icon === '01d') {
              document.body.style.background = "linear-gradient(to right, #1c92d2, #f2fcfe)";
            } else {
              document.body.style.background = "linear-gradient(to right, rgba(84, 84, 84, 0.7), rgba(84, 84, 84, 0.7)), linear-gradient(to right, #1c92d2, #f2fcfe)";
            }
            break;
          case 'Clouds':
            if (icon === '02d' || icon === '03d' || icon === '04d') {
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



    //behavior on clicking Go button
    let go = document.querySelector('#search');
    let cityInput = document.querySelector('#city');

    //let cityRequest = new XMLHttpRequest();

    //grab input value on click
    go.addEventListener("click", function() {
      let city = cityInput.value;
      let cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b056e3da825f49292fe0d4b5f8f8d9b3`;
      console.log(city);
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
        request.open("GET", cityUrl, true);
        request.send();
      }
    });

    // cityRequest.onreadystatechange = function() {
    //   if (this.readyState === 4 && this.status === 200) {
    //     let cityResponse = JSON.parse(this.responseText);
    //     console.log(cityResponse);
    //
    //     // let latText = document.querySelector('#latitude');
    //     // let lonText = document.querySelector('#longitude');
    //     latText.textContent = "Latitude: " + response.coord.lat;
    //     console.log(response.coord.lat);
    //     lonText.textContent = "Longitude: " + response.coord.lon;
    //   } else {
    //     let location = document.querySelector('#location');
    //     location.textContent = "Is your city spelled correctly?";
    //   }
    // }

    // request.open("GET", cityUrl, true);
    // request.send();



  });
};

// function daylight(timestamp) {
//   let date = new Date(timestamp * 1000);
//   let hours = date.getHours();
//   let minutes = "0" + date.getMinutes();
//   let seconds = "0" + date.getSeconds();
//   let formattedTime = hours + minutes.substr(-2) + seconds.substr(-2);
//   console.log(formattedTime);
// }
