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

  console.log(populationdata);
//   map.eachLayer(function (layer) {
//     map.removeLayer(layer);
// });
    // Insert the layer beneath any symbol layer.

  map.setZoom(zoom);
  L.control.scale().addTo(map);


  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1Ijoia3VsaW5pIiwiYSI6ImNpeWN6bjJ0NjAwcGYzMnJzOWdoNXNqbnEifQ.jEzGgLAwQnZCv9rA6UTfxQ"
  }).addTo(map);

  const client = new carto.Client({
    apiKey: CARTO_API_KEY,
    username: USER_NAME
  });
    // cartocss: '#cartodb1 {polygon-fill: #7bd490;polygon-opacity: 0.7;line-color: #6da57a;line-width: 0.5;line-opacity: 1;}'
  
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
      popup.setLatLng(featureEvent.latLng);
      if (!popup.isOpen()) {
        popup.openOn(map);
      }
    }
    function closePopup(featureEvent) {
      popup.removeFrom(map);
    }
    layer.off('featureClicked');
    layer.on('featureOver', openPopup);
    layer.on('featureOut', closePopup);  
  });   
  
  return map;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function closePopup(featureEvent) {
  popup.removeFrom(map);
}  

  