// JS file with only functions
function construct() {
  // set the ranges
    x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1);
    y = d3.scaleLinear().range([height, 0]);
  
    // D3 Axis - renders a d3 scale in SVG
    xAxis = d3.axisBottom(x);
  
    yAxis = d3.axisLeft(y)
                  .tickFormat(d3.format(".0s"));
  
    // Set the chart area
    svg = d3.select("#population-graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + 
                    ", " + margin.top + ")")
            .classed("svg-content-responsive", true);         
      
    // add the x Axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
  
    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("class", "y axis")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population");
  
      //Add label
      labelsX = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("font-weight", "bold")
      .attr("font-size", "medium")
      .text("Year");
  
      // Create group for  2 y- axis labels
      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "large")
      .attr("color", "red")
      .text("Population");  
  }
  
/////////////////////// Parse the data for barchart ///////////////////////////
function parsedata(placename){
  // console.log(populationdata)
  //clear the list
  selectedLocations = []
  var locations = []
  console.log(placename)
  populationdata.forEach((location) => {
    var result= new Array();
      Object.entries(location).forEach(([key, value]) => { 
        if(key == 'data'){
          value.forEach((d) => {
            var items = {};
            items["place"] = location.place;
            items["year"] = d.Year;
            items["population"] = +d.population;
            result.push(items);
          })        
        }
      })
      locations.push(result);
      selectedLocations.push(result);
    })
    // if place name is empty return all the locations
    if (placename.length > 0){
      selectedLocations = []
      //return just one
      locations.forEach(function(d){
        console.log(d.place)
        if (d[0].place == placename){
          selectedLocations.push(d);
        }
      })
    } 
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function allLocations(){
  parsedata("")
  var allLoc = []
  for (let i = 0; i < selectedLocations[0].length; i++){
    var jsons = new Array();
    jsons.push(selectedLocations[0][i])
    jsons.push(selectedLocations[1][i])
    jsons.push(selectedLocations[2][i])  
    allLoc.push(jsons)
  }  
  return allLoc;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Replay the data taking each year 
function replay() {
  data = selectedLocations[0];
  var slices = [];
  for (var i = 0; i < data.length; i++) {
    slices.push(data.slice(0, i+1));
  }

  slices.forEach(function(slice, index){
    setTimeout(function(){
      draw(slice);
    }, index * 300);
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function plotZipcodes(datasources, featureOverColumns, color, zoom){
//Plot the zipcodes on cartoDB with dataSource

console.log(populationdata);

map.setZoom(zoom);
L.control.scale().addTo(map);

var mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_KEY;
L.tileLayer(mapboxUrl).addTo(map);

const client = new carto.Client({
  apiKey: CARTO_API_KEY,
  username: USER_NAME
});

datasources.forEach(d => {
  const source = new carto.source.Dataset(d);
  var cssString = ""
  cssString = cssString.concat('#', d, ' {polygon-fill: #7bd490;polygon-opacity: 0.7;line-color: ', color, ';line-width: 0.5;line-opacity: 1;}');
  const style = new carto.style.CartoCSS(cssString);
  const layer = new carto.layer.Layer(source, style,  {
  featureOverColumns:featureOverColumns});

  client.addLayer(layer);
  client.getLeafletLayer().addTo(map);

  const popup = L.popup({ closeButton: false }); 

  function openPopup(featureEvent) {
    let content = '<div class="widget">';
    if (featureEvent.data.zcta5ce10) {
      content += `<h5 class="h5">${featureEvent.data.zcta5ce10}</h5>`;
    }

    content += `</div>`;

    popup.setContent(content);
    // console.log(featureEvent.latLng);
    popup.setLatLng(featureEvent.latLng);
    if (!popup.isOpen()) {
      popup.openOn(map);
    }
  }

  function closePopup(featureEvent) {
    popup.removeFrom(map);
  }

  // layer.off('featureClicked');
  layer.on('featureOver', openPopup);
  layer.on('featureOut', closePopup);  

  layer.on('featureClicked',function(e){      
      // map.setView(e.latLng, ZIP_ZOOM);
      console.log(map.getZoom());
    if (map.getZoom() < ZIP_ZOOM){

      // map.setView(e.latLng, ZIP_ZOOM);
      showZipMap(e.latLng.lat, e.latLng.lng)
      // map.setStyle('mapbox://styles/mapbox/dark-v9');
    }
    else{
      console.log(map.getZoom());
      showTexasMap();
    }
  });

});   

return map;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showZipMap(lat, long){
//Zoom in to Austin map 

zoomm = map.getZoom();
if (map != undefined) {
  console.log("remove")
  map.remove();
}
mapboxgl.accessToken = MAPBOX_KEY;
map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/satellite-streets-v10',
    center: [long, lat], //[-97.7431, 30.2672],
    zoom: zoomm,
    pitch:60,
    bearing: 0,
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

    map.zoomTo(15, {duration: 5000});
    //Set the timer to wait for zoom before whanging the mapboxID

    setTimeout(function(){ 
      // map.easeTo([long, lat], 15, -17.6, 60)

      map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          // 'filter': ['==', 'extrude', 'true'],
          'type': 'symbol', //[fill, line, symbol, circle, heatmap, fill-extrusion, raster, hillshade, background]
          'minzoom': 15,
      }, labelLayerId);
  }, 6000);
});      

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showTexasMap(){
//Show texas map
console.log("showTexasMap");

color = '#fd7e14';
latlog = populationdata[0].coordinates;
zoom = STATE_ZOOM;
//Plot zipcode boundries
plotZipcodes(['tx_texas_zip_codes_geo_min'], ['zcta5ce10'], color,  zoom); 

//Add the marker on each zipcode
var marker = new L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {})
    }
});

showTilesMap(latlog);

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showTilesMap(latlog){
//Show tile map for texas.

console.log(latlog);

map.setView(latlog, STATE_ZOOM)

var accessToken = 'pk.eyJ1IjoidHJ1cHRpc2FtYW50IiwiYSI6ImNqb3ZxeTJ2eTFwamQzdHBpN2pxMWRncm0ifQ.lSg57pODMZLvUx2AhOwALQ';
var id = 'streets-v9'
var satellite = 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_KEY
var dark = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_KEY
var light = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_KEY
var navigation = 'https://api.mapbox.com/styles/v1/mapbox/navigation-guidance-day-v4/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_KEY

var satelliteMap = L.tileLayer(satellite),
  darkMap = L.tileLayer(dark);
  lightmap = L.tileLayer(light);
  navigationmap = L.tileLayer(navigation);

var baseLayers = {
"Satellite": satelliteMap,
"Dark": darkMap,
"Light": lightmap,
"Navigation": navigationmap
};

L.control.layers(baseLayers).addTo(map);
}



