// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'

var populationdata = []

// Set the Margin
var margin = { left:80, right:10, top:10, bottom:50 };
var height = 800 - margin.top - margin.bottom, 
  width = 800 - margin.left - margin.right;

var pdata = []
var x;
var y;
var xAxis;
var yAxis;
var svg;
var labelsX ;
var interupted = false;
var selectedLocations = [];

  //Plot zipcodes with the help of cartoDB
var map = L.map('map',{ 
  // maxBounds:maxUSBounds,
  zoom: 4,
  center: [31.9686,-98.5795]
  });
var mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJ1cHRpc2FtYW50IiwiYSI6ImNqb3ZxeTJ2eTFwamQzdHBpN2pxMWRncm0ifQ.lSg57pODMZLvUx2AhOwALQ'
L.tileLayer(mapboxUrl).addTo(map);


construct();

//Add onclick
$("#each-place-button")
.on("click", eachPlaceclick) ;

//Add onclick
// $("#map")
// .on("click", showUSPopulation) ;



//Add onclick
// $("#compare-button")
// .on("click", compareButtonclick) ; 


/////////////////////////////////////////////////////////////////////////////////////
d3.json("/population").then(successHandle, errorHandle);

function errorHandle(error){
    console.log("Failed")
  throw error;
}
    
/////////////////////////////////////////////////////////////////////////////////////
function successHandle(data){

  populationdata = data;

  var namesplaces = []
  populationdata.forEach((location) => { 
  namesplaces.push(location.place) ;})

  plot("US")
    // console.log(namesplaces)

    selectGroup = d3.select(".dropdown-menu")
    console.log(namesplaces);

    /// Create a Drop down 
    namesplaces.forEach(d=> {
    selectGroup
      .append("a").attr("class","dropdown-item")
      .text(d)
      .on('click', onSelectCountryChange)
    });

    function onSelectCountryChange(){

      var selText = $(this).text();
      $("#dropdownMenuButton").text(selText);
      plot(selText)
    }

  //populationCitiesDropDown(namesplaces);     
  
  // map.setView(populationdata[2].coordinates);
  // map.setZoom(4);
  // setTimeout(function(){
  //     map.setView(populationdata[1].coordinates);
  //     map.setZoom(6);
  // }, 2000);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function plot(selText){

    map.remove();
    map = L.map('map',{ 
      // maxBounds:maxUSBounds,
      zoom: 4,
      center: [31.9686,-98.5795]
      });
      var mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJ1cHRpc2FtYW50IiwiYSI6ImNqb3ZxeTJ2eTFwamQzdHBpN2pxMWRncm0ifQ.lSg57pODMZLvUx2AhOwALQ'
      L.tileLayer(mapboxUrl).addTo(map);

  if (selText === "US"){
    dataSources = ['zipregions1', 'zipregions2', 'zipregions3'];
    var color = '#2b68a8'
    plotZipcodes(dataSources, ['the_geom'], color, 4); 
  }
  else if (selText === "Texas"){
    console.log("in Texas")
    showTexasMap();
  }
  else {
    showAustinMap();
  }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function showAustinMap(){
//   console.log("showAustinMap");

//   map.setView([30.2672, -97.7431], 12)

//   var accessToken = 'pk.eyJ1IjoidHJ1cHRpc2FtYW50IiwiYSI6ImNqb3ZxeTJ2eTFwamQzdHBpN2pxMWRncm0ifQ.lSg57pODMZLvUx2AhOwALQ';
//   var id = 'streets-v9'
//   var mapboxUrl1 = 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJ1cHRpc2FtYW50IiwiYSI6ImNqb3ZxeTJ2eTFwamQzdHBpN2pxMWRncm0ifQ.lSg57pODMZLvUx2AhOwALQ'

//   var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
//      landUrl = 'https://{s}.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/{z}/{x}/{y}.png';
//     //  mapbox://styles/mapbox/satellite-streets-v10


//   var osmMap = L.tileLayer(osmUrl, {minZoom: 10}),
//       landMap = L.tileLayer(mapboxUrl1, {minZoom: 10});
//       osmbuild = L.tileLayer(landUrl, {minZoom: 10});

//   map.addLayer(osmMap);
//   // map.addLayer(landMap);
//   // osmMap.setView([30.2672, -97.7431], 18);
//   // osmMap.setZoom(18)
//   // console.log(map.getStyle().layers);
//   var baseLayers = {
//   "OSM Mapnik": osmMap,
//   "Landscape": landMap,
//   "Building": osmbuild
//   };

//   L.control.layers(baseLayers).addTo(map);

//}
////////////////////////////////////////////////////////////////////////////////////////////////////////

function showAustinMap(){

  zoomm = map.getZoom();
  if (map != undefined) {
    console.log("remove")
    map.remove();
 }
  mapboxgl.accessToken = 'pk.eyJ1IjoidHJ1cHRpc2FtYW50IiwiYSI6ImNqb3ZxeTJ2eTFwamQzdHBpN2pxMWRncm0ifQ.lSg57pODMZLvUx2AhOwALQ';
  map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [ -97.7431, 30.2672],
      zoom: zoomm,
      pitch: 90,
      bearing: -17.6,
      container: 'map'
  });
  
  // The 'building' layer in the mapbox-streets vector source contains building-height
  // data from OpenStreetMap.
  map.on('load', function() {
      // Insert the layer beneath any symbol layer.
      var layers = map.getStyle().layers;
      console.log(layers)
  
      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
              labelLayerId = layers[i].id;
              break;
          }
      }

      map.zoomTo(15, {duration: 9000});
      setTimeout(function(){ 
        map.setStyle('mapbox://styles/mapbox/satellite-streets-v10')
  
        map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#bbb',
    
                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                'fill-extrusion-height': [
                    "interpolate", ["linear"], ["zoom"],
                    15, 0,
                    15.05, ["get", "height"]
                ],
                'fill-extrusion-base': [
                    "interpolate", ["linear"], ["zoom"],
                    15, 0,
                    15.05, ["get", "min_height"]
                ],
                'fill-extrusion-opacity': .9
            }
        }, labelLayerId);
    }, 9000);
  });      
}
  

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showTexasMap(){
  console.log("showTexasMap");

  color = '#fd7e14';
  latlog = populationdata[0].coordinates;
  zoom = 6;
  plotZipcodes(['tx_texas_zip_codes_geo_min'], ['zcta5ce10'], color,  zoom); 

  var markers = new L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {})
      }
  });

  markers.on("click", function (event) {
    // Assuming the clicked feature is a shape, not a point marker.
    map.fitBounds(event.layer.getBounds());
});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showUSPopulation(d) 
{ 
    console.log(map.getZoom());
    // $("#loadFormModal").show();
    $(".modal").show();
  // console.log(populationdata);
    // get the data in desire json format and plot
    if(map.getZoom() < 5){
      d3.select("svg").remove()
      construct()
      parsedata("US")
      replay()
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function draw(data) {

  // set the tile of the Modal
  d3.select(".modal-title").text(`${data[0].place} population from ${data[0].year} to ${data[data.length-1].year}`);
  // measure the domain (for x, unique letters) (for y [0,maxFrequency])
  // now the scales are finished and usable
  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.population; })]);

  // another g element, this time to move the origin to the bottom of the svg element
  // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
  //   for everything in the selection\
  // the end result is g populated with text and lines!
  svg.select('.x.axis').transition()
    .duration(300)
    .call(xAxis)
    .selectAll("text")	
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")    
    .attr("y", 0)
    .attr("x", 0)
    .attr("transform", d => "rotate(-90)");

  // same for yAxis but with more transform and a title
  svg.select(".y.axis").transition().duration(300).call(yAxis)

  // THIS IS THE ACTUAL WORK!
  var bars = svg.selectAll(".bar").data(data, function(d) { return d.year; }) // (data) is an array/iterable thing, second argument is an ID generator function

  bars.exit()
    .transition()
    .duration(300)
    .attr("y", y(0))
    .attr("height", height - y(0))
    .style('fill-opacity', 1e-6)
    .remove();

  // data that needs DOM = enter() (a set/selection, not an event!)
  bars.enter().append("rect")
    .attr("class", "bar")
    .attr("y", y(0))
    .attr("height", height - y(0));

  // the "UPDATE" set:
  bars.transition().duration(300).attr("x", function(d) { return x(d.year); }) // (d) is one item from the data array, x is the scale object from above
    .attr("width", x.bandwidth()) // constant, so no callback function(d) here
    .attr("y", function(d) { return y(d.population); })
    .attr("height", function(d) { return height - y(d.population); }); // flip the height, because y's domain is bottom up, but SVG renders top down

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function populationCitiesDropDown(namesplaces){
  // console.log(namesplaces);

  var select = d3.select('.modal-header')
    .append('select')
      .attr('class','select')
      .on('change',onchange)
  
  var options = select
    .selectAll('option')
    .data(namesplaces).enter()
    .append('option')
      .text(function (d) { return d; });
  
  function onchange() {
    var selectValue = d3.select('select').property('value')


    d3.select("svg").remove()
    construct()
    parsedata( selectValue)
    replay()
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function eachPlaceclick(d) 
{ 
    console.log("eachPlaceclick");
  // console.log(populationdata);
    // get the data in desire json format and plot
    d3.select("svg").remove()
    construct()
    if(map.getZoom() < 5){
      parsedata("US")
    }
    else if (map.getZoom() < 7) {
      parsedata("Texas");      
    } else {
      parsedata("Austin");      
    }
    replay()
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




