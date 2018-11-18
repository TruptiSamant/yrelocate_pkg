
// code for choose your city 

 // ****** make pictures as icone of markers when the client chose city

 var customOptions =
   {
   'maxWidth': '500',
   'className' : 'custom'
   }
 
// function for dropdwon changed values 
function getData(dataset) {
  switch (dataset) {
  case "Austin":
  var markers=[];
  for(var i=0;i< Austinphotos.length; i++){
      var picture=L.icon({
        iconUrl:Austinphotos[i].url,
        iconSize: [50, 50], // size of the icon
        popupAnchor: [0,-15]
        })
    var customPopup= `${Austinphotos[i].name }<br/><img src= ${Austinphotos[i].url} width='350px'/>`
      markers.push(
        L.marker(Austinphotos[i].coordinates, {icon: picture}).bindPopup(customPopup,customOptions).addTo(myMap)
      )
    }
   
    // set Timeout Function to move
    setTimeout(function () {
      var group = L.featureGroup(markers).addTo(myMap);
      myMap.fitBounds(group.getBounds());
    }, 500);
    break;
  case "Dallas":
  var markers=[];
  for(var i=0;i< Dallasphoto.length; i++){
      var picture=L.icon({
        iconUrl:Dallasphoto[i].url,
        iconSize: [50, 50], // size of the icon
        popupAnchor: [0,-15]
        })
    var customPopup= `${Dallasphoto[i].name }<br/><img src= ${Dallasphoto[i].url} width='350px'/>`
      markers.push(
        L.marker(Dallasphoto[i].coordinates, {icon: picture}).bindPopup(customPopup,customOptions).addTo(myMap)
      )
    }
   
    // set Timeout Function to move
    setTimeout(function () {
      var group = L.featureGroup(markers).addTo(myMap);
      myMap.fitBounds(group.getBounds());
    }, 500);

    break;

  case "Houston":
  var markers=[];
  for(var i=0;i< Houstonphotos.length; i++){
      var picture=L.icon({
        iconUrl:Houstonphotos[i].url,
        iconSize: [50, 50], // size of the icon
        popupAnchor: [0,-15]
        })
    var customPopup= `${Houstonphotos[i].name }<br/><img src= ${Houstonphotos[i].url} width='350px'/>`
      markers.push(
        L.marker(Houstonphotos[i].coordinates, {icon: picture}).bindPopup(customPopup,customOptions).addTo(myMap)
      )
    }
   
    // set Timeout Function to move
    setTimeout(function () {
      var group = L.featureGroup(markers).addTo(myMap);
      myMap.fitBounds(group.getBounds());
    }, 500);
  
    break;
  }
}

// *************************************************
// code for housing Type part:
// jsut check we need to write our code for that

function optionchenged(info) {
  switch (info) {
    case "Buy":
      console.log("hi")
      d3.json("/housing").then(successHandle);

      function successHandle(result){
        console.log(result)
      }
      function errorHandle(error){s
        console.log(error)
      }
    break;

    case "Rent":
      d3.json("/housing").then(successHandle, errorHandle);
      function successHandle(result){
        console.log(result)
      }
      function errorHandle(error){
        console.log(error)
      }
    break;
  }
}

// ******************
// check box function 
function handlecheck (){
  d3.json("/population").then(successHandle, errorHandle);
      function successHandle(result){
        console.log(result)
      }
      function errorHandle(error){
        console.log(error)
      }
}