// define USA geometry to show in map 
var maxBounds = [
  [5.499550, -167.276413], //Southwest
  [83.162102, -52.233040]  //Northeast
];

// // define map object with maxbounds 
var myMap= L.map('map', {
  'center': [37.0902, -95.7129],
  'zoom': 2.5})
  //'maxBounds': maxBounds})
// }).fitBounds(maxBounds);



// // Adding a tile layer (the background map image) to our map
// // We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 50,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);





