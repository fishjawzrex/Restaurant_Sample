window.onload = geolocate;
// main geolocate function;
/* checks to see if geolocation is available, then proceeds to call
the getCurrentPosition method; this method takes two parameteres:
success handler, error handler, and options. */
function geolocate(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(displayLocation, displayError);
  }
  else{
    alert("geolocation not available!");//alerts user when geoclocation is not available
  }
}
// ourCoords is the destination position for Wickedly smart HQ
// we will pass this into the computeDistance function as the second parameter
var ourCoords = {
 latitude: 39.9526,
 longitude: -75.1652
};
//declare map variable for later use
var map;
function showMap(coords){
  //create object with google maps' LatLng constructor
  //we will center the map around this point
  var googleLatAndLong = new google.maps.LatLng(ourCoords.latitude, ourCoords.longitude);
  var mapOptions = {
     zoom: 10,
     center: googleLatAndLong,
     mapTypeId: google.maps.MapTypeId.ROADMAP
   };
  var mapDiv = document.getElementById("map");
  map = new google.maps.Map(mapDiv, mapOptions);
  // the following protocol is used to add a marker to your position on the map
  var title = "Your Location";
  var content = "You are here: " + coords.latitude + ", " + coords.longitude;
  addMarker(map, googleLatAndLong, title, content);
}
function computeDistance(startCoords, destCoords){
  var startLatRads = degreesToRadians(startCoords.latitude);
  var startLongRads = degreesToRadians(startCoords.longitude);
  var destLatRads = degreesToRadians(destCoords.latitude);
  var destLongRads = degreesToRadians(destCoords.longitude);
  var Radius = 6371; // radius of the Earth in km
  //use haversine formula to calculate the distance between the coordinates
  var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
  Math.cos(startLatRads) * Math.cos(destLatRads) *
  Math.cos(startLongRads - destLongRads)) * Radius;
  return distance;
}
function degreesToRadians(degrees){
  var radians = (degrees * Math.PI)/180;
  return radians;
}
function displayLocation(position){
  //the navigator.geolocation.getCurrentPosition method passes position object into
  //the displayLocation success handler
  var long = position.coords.longitude;//assign lat and long data attributes to variables
  var lat = position.coords.latitude;
  var distance = computeDistance(position.coords, ourCoords);//call computeDistance function
  var div = document.getElementById("distance");
  div.innerHTML = "You are " + distance + " km from Our Kitchen!";
  showMap(position.coords);//invoke showMap to display google map

}
function addMarker(map, latlong, title, content) {
 var markerOptions = {
   position: latlong,
   map: map,
   title: title,
   clickable: true
 };
 var marker = new google.maps.Marker(markerOptions);
 var infoWindowOptions = {
   content: content,
   position: latlong
 };
 var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
 google.maps.event.addListener(marker, "click", function() {
   infoWindow.open(map);
 });
}

//error function handles error codes and diplays appropriate message for the user
function displayError(error){
  var errorTypes = {
 0: "Unknown error",
 1: "Permission denied by user",
 2: "Position is not available",
 3: "Request timed out"
 };
 var errorMessage = errorTypes[error.code];
 if (error.code == 0 || error.code == 2) {
 errorMessage = errorMessage + " " + error.message;
 }
 var div = document.getElementById("location");
 div.innerHTML = errorMessage;
}
