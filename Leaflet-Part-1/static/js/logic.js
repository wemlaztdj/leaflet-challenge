function createMap(Earthquake) {

    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
    "Street Map": streetmap
    };

    let overlayMaps = {
    "Earthquakes": Earthquake
    };

    let map = L.map("map", {
    center: [50, -134],
    zoom: 5,
    layers: [streetmap, Earthquake]
    });

    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(map);
    legend.addTo(map)
}
function markerSize(value) {
  return value * 10000;
}

function createMarkers(response) {


    let stations = response;
  

    let earthquakeMarkers = [];
  
    // Loop through the array.
    for (let index = 0; index < stations.length; index++) {
      let station = stations[index];
  

      let earthquakeMarker = L.circle([station.latitude, station.longitude],{
            stroke: false,
            fillOpacity: 0.75,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillColor: getColor(station.depth),
            radius: markerSize(station.mag)
          }).bindPopup("<h3><h3>" + station.place+"<h3><h3>Magnitude " + station.mag + "<h3><h3>Depth: " + station.depth + "</h3>");
  
      // Add the marker to the array.
      earthquakeMarkers.push(earthquakeMarker);
    }

    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquakeMarkers));
  }

  function getColor(depth) {
    return depth > 90 ? '#ff5f64' :
           depth > 70  ? '#fca25e' :
           depth > 50  ? '#fcb62a' :
           depth > 30   ? '#f7db11' :
           depth > 10   ? '#dcf402' :
                          '#a4f600';
  }

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10,30, 50,70,90],
        labels = [];
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<div style="display: flex; align-items: center;">' +
        '<div style="background:' + getColor(grades[i] + 1) + '; width: 18px; height: 18px; margin-right: 8px;"></div>' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+') +
        '</div>';
    }
    return div;
  };
  
  

var locations = []
var url= 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(url).then(function(response) {
  var earthquakes=response.features
  console.log(response);
  console.log(earthquakes);
  for (var i = 0; i < earthquakes.length; i++){
    var earthquake={}
    earthquakes[i].geometry.coordinates
    earthquake['longitude']=earthquakes[i].geometry.coordinates[0]
    earthquake['latitude']=earthquakes[i].geometry.coordinates[1]
    earthquake['depth']=earthquakes[i].geometry.coordinates[2]
    earthquake['mag']=earthquakes[i].properties.mag
    earthquake['place']=earthquakes[i].properties.place
    locations.push(earthquake)
  }
  console.log(locations)
  createMarkers(locations) 
  
})

