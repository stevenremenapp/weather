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
        //console.log(request.responseText);
        console.log(request.main.temp);
      }
    }

    request.open("GET", url, true);
    request.send();

  });
};
