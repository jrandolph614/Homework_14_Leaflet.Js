var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


function getColor(d) {
    return d> 8.0 ? "#d73027":
           d> 6.9 ? "#fc8d59":
           d> 6.0 ? "#fee08b":
           d> 5.4 ? "#ffffbf":
           d> 2.5 ? "#d9ef8b":
           d> 0.0 ? "#91cf60":
                    "#1a9850";
}

function createFeatures(earthquakeData) {
    var quake_data = earthquakeData.features;
    var marker_data = [];
    for (var i = 0; i < quake_data.length; i ++) {
        var all_quakes = quake_data[i];
        var circleOptions = { 
            radius: all_quakes.properties.mag * 3.5,
            fillColor: getColor(all_quakes.properties.mag),
            color: getColor(all_quakes.properties.mag),
        };
        var cirlclesGroup = L.circleMarker([all_quakes.geometry.coordinates[1], all_quakes.geometry.coordinates[0]], circleOptions)
        .bindPopup("<h3>" + all_quakes.properties.place + "<h3><hr><p>" 
        + new Date(all_quakes.properties.time) + "</p><hr><p>"
        + "Magnitude: " + all_quakes.properties.mag + "</p>");

        marker_data.push(cirlclesGroup);
    }
    createMap(L.layerGroup(marker_data));
}
d3.json(queryUrl, createFeatures);
var plates = "PB2002_boundaries.json";

var tectonic =  L.layerGroup();

d3.json(plates, function(data){
    L.geoJSON(data, {
        color: "#91cf60",
        weight: 5
    }).addTo(tectonic)
});
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    var pirates = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.pirates",
      accessToken: API_KEY
    });
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    
    
    // object to hold base layers
    var baseMaps = {
        "Dark Map": darkmap,
        "Street Map ": streetmap,
        "Satelite Map": satellite,
        "Pirates!" : pirates
    };
    // object to hold overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonic
    }
    var myMAP = L.map("map", {
        center: [ 37.09, -95.71
        ],
        zoom: 5,
        layers: [darkmap, earthquakes, tectonic]
    });
    //Create a layer control
    //Pass in base map and overlays
    //add thelayer control to the map 
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMAP);

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function (myMAP) {
        var div = L.DomUtil.create("div", "info legend");
        legendColor = ["#1a9850", "#91cf60", "#d9ef8b", "#ffffbf", "#fee08b", "#fc8d59", "#d73027" ],
            grades = [0.0, 2.5, 5.4, 6.0, 6.0, 8.0],
            labels = ["<h4> Magnititude of Earthquake </h4>"];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += 
			labels.push(
					'<span style="background-color:' + legendColor[i] + '"> ' + '&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;' +
					(grades[i] ? grades[i] : '0+'));

		}
		div.innerHTML = labels.join("<br />");
        return div;
    };
    legend.addTo(myMAP);
}