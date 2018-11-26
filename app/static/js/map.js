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
      zoom: US_ZOOM,
      center: [31.9686,-98.5795]
      });


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
    showZipMap(30.2672, -97.7431);
  }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showUSPopulation(d) 
{ 
  //Show US population 

  console.log(map.getZoom());
  // $("#loadFormModal").show();
  $(".modal").show();
  // console.log(populationdata);
  // get the data in desire json format and plot
  if(map.getZoom() < US_ZOOM+1){
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
    if(map.getZoom() < STATE_ZOOM+1){
      parsedata("US")
    }
    else if (map.getZoom() < STATE_ZOOM+1) {
      parsedata("Texas");      
    } else {
      parsedata("Austin");      
    }
    replay()
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




