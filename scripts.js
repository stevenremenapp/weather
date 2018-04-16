//Get latitude, longitude, accuracy, and timestamp
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var loc = document.querySelector('#data');
    var acc = document.querySelector('#accuracy');
    var ts = document.querySelector('#timestamp');
    loc.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
    acc.innerHTML = "Accuracy: " + position.coords.accuracy + " m";
    var timeStamp = new Date(position.timestamp);
    ts.innerHTML = "Time: " + timeStamp.toLocaleString();
  })
}
