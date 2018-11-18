// @TODO: YOUR CODE HERE!


// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
// var myMap = L.map("map", {
//     center: [45.52, -122.67],
//     zoom: 13
//   });
 
// console.log("I am in map.js")
//   // Adding a tile layer (the background map image) to our map
//   // We use the addTo method to add objects to our map
//   L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.streets",
//     accessToken: API_KEY
//   }).addTo(myMap);


d3.json("/population").then(successHandle, errorHandle);

function errorHandle(error){
    console.log("Failed")
  throw error;
}

function successHandle(data){
    var myMap = L.map("map", {
        center: data[0].coordinates,
        zoom: 2
      });




    //   var map = L.map("map").setView([48.85, 2.35], 10);

var markers = [
  L.marker([35.2072185 , -101.8338246]),
  L.marker([31.8160381 , -99.5120986]),
  L.marker([25.63978365 ,-100.293101629066])
];

var group = L.featureGroup(markers).addTo(myMap);

setTimeout(function () {
    myMap.fitBounds(group.getBounds());
}, 3000);


L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    // maxZoom: 6,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

    console.log(data)
}

