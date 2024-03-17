// const map = L.map('map').setView([51.505, -0.09], 13);

// 	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 		maxZoom: 19,
// 		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// 	}).addTo(map);

// 	const marker = L.marker([51.5, -0.09]).addTo(map)
// 		.bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

// 	const circle = L.circle([51.508, -0.11], {
// 		color: 'red',
// 		fillColor: '#f03',
// 		fillOpacity: 0.5,
// 		radius: 500
// 	}).addTo(map).bindPopup('I am a circle.');

// 	const polygon = L.polygon([
// 		[51.509, -0.08],
// 		[51.503, -0.06],
// 		[51.51, -0.047]
// 	]).addTo(map).bindPopup('I am a polygon.');


// 	const popup = L.popup()
// 		.setLatLng([51.513, -0.09])
// 		.setContent('I am a standalone popup.')
// 		.openOn(map);

// 	function onMapClick(e) {
// 		popup
// 			.setLatLng(e.latlng)
// 			.setContent(`You clicked the map at ${e.latlng.toString()}`)
// 			.openOn(map);
// 	}

// 	map.on('click', onMapClick);


// var map = L.map('map').setView([34.43854, -111.39367995967369], 12); // Set the initial map view

  // Add OpenStreetMap tile layer
  // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   maxZoom: 19,
  //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  // }).addTo(map);
  // / Define the basemap layers
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
});

var imagery = L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Imagery &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
});


var topographic = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
});

var terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://stamen.com">Stamen Design</a>'
});

var snowLayer = L.tileLayer('data/SNODAS/img100/{z}/{x}/{y}.png', {
  tms: true,
  attribution: 'Your attribution',
  maxZoom: 12
});

var snowLayer_swe = L.tileLayer('data/SNODAS/img100_swe_2/{z}/{x}/{y}.png', {
  tms: true,
  attribution: 'Your attribution',
  maxZoom: 12
});
// Define basemap layer selector
// var baseLayers = {
//     "Streets": streets,
//     "Imagery": imagery,
//     "Topographic": topographic,
//     "Terrain": terrain
// };

// Create map instance
var map = L.map('map', {
  layers: [streets] // Default basemap layer
}).setView([34.43854, -111.39367995967369], 12);


var baseMaps = [
  { 
    groupName : "Base Maps",
    expanded : true,
    layers    : {
      "Streets": streets,
    "Imagery": imagery,
    "Topographic": topographic,
    "Terrain": terrain
    }
  }							
];	


var options = {
  container_width 	: "250px",
  container_maxHeight : "300px", 
  group_maxHeight     : "80px",
  exclusive       	: false,
  // collapsed: false
};


var circle;
console.log(snowLayer_swe);
var olayers = {};

var circleLayerCustomID = 'myCircleLayer';

  var circleLayer = L.layerGroup();
  circleLayer._leaflet_id = circleLayerCustomID; 

  // Create a hashmap for station IDs
  var stationHashMap = {};

  // Parse CSV file
  Papa.parse('data/SNOTEL/az_snotel.csv', {
    download: true,
    header: true,
    complete: function(results) {
      var data = results.data;
      data.forEach(function(row) {
        // Extract latitude, longitude, and station ID
        var lat = parseFloat(row.Latitude);
        var lng = parseFloat(row.Longitude);
        var stationId = row['Station Id'];
  
        // Create circle options
        var circleOptions = {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 500 // Initial radius in meters
        };
  
        // Create circle
        var circle = L.circle([lat, lng], circleOptions).addTo(circleLayer);
        circle.bindTooltip('Station ID: ' + stationId);
  
        // Function to update circle radius based on zoom level
        function updateCircleRadius() {
          var zoom = map.getZoom();
          var newRadius = 500 / Math.pow(2, zoom - 10); // Adjust the division factor as needed
          circle.setRadius(newRadius);
        }
  
        // Event listener to update circle radius when map zoom changes
        map.on('zoomend', updateCircleRadius);
  
        // Initial update of circle radius
        updateCircleRadius();
  
        // Add station ID to hashmap
        stationHashMap[stationId] = circle;
      });
    }
  });
  

  olayers['SNOTEL'] = circleLayer;

  // Function to retrieve circle by station ID
  function getCircleByStationId(stationId) {
    return stationHashMap[stationId];
  }

  	


  // fetch('output4.geojson')
  //   .then(response => response.json())
  //   .then(data => {
  //       // console.log(data);
  //      WB_HU4 = L.geoJSON(data, {
  //           style: function(feature) {
  //             return {
  //               fillOpacity: 0.1,   // Change the fill opacity
  //               weight: 1           // Change the border weight
  //             };
  //           }
  //         });
  //         WB_HU4._leaflet_id = 'WB_HU4';
  //         // olayers['WBHU4'] = WB_HU4;
  //   });


    function addWatershedBoundary(watershedGeoJSONFile,ws) {
      var watershed_boundary = new L.geoJson();
      $.ajax({
          url: watershedGeoJSONFile,
          beforeSend: function(xhr) {
              if (xhr.overrideMimeType) {
                  xhr.overrideMimeType("application/json");
              }
          },
          dataType: "json",
          success: function(data) {
              $(data.features).each(function(key, data) {
                  watershed_boundary.addData(data);
                  watershed_boundary.setStyle({
                      "fillOpacity": 0.1
                  });
              });
          }
      });
      watershed_boundary._leaflet_id = ws;
      return watershed_boundary
  }   
  olayers['WB_HU4'] = addWatershedBoundary('data/WBD/wbdhu4_salt.geojson','WB_HU4');
  olayers['WB_HU6'] = addWatershedBoundary('data/WBD/output.geojson','WB_HU6');
  olayers['WB_HU10'] = addWatershedBoundary('data/WBD/output10.geojson','WB_HU10');

console.log(olayers);
var SnowMaps = [
    { 
      groupName : "Snow Maps",
      expanded : true,
      exclusive: true,
      layers    : {
        "SNODAS Depth": snowLayer,
      "SNODAS SWE": snowLayer_swe,
     
      }
    },
    { 
      groupName : "Overlays",
      expanded : true,
      exclusive: true,
      layers    : olayers
    }									
  ];
    // var Overlays = [
      					
    // ];	

var control = L.Control.styledLayerControl(baseMaps, SnowMaps, options).addTo(map);
// var container = control.getContainer();



  
  // Function to update the SWE and Depth layers based on the selected date
// function updateSnowLayers(date) {
//   map.eachLayer(function(layer_1) {
//     console.log(layer_1);
//     map.removeLayer(layer_1);
// });
//   // Remove existing layers from SnowMaps array
//   map.removeControl(control);

//   // Add new SWE and Depth layers based on the selected date
//   var tsnowLayer = L.tileLayer('SNODAS_SWE_301221/{z}/{x}/{y}.png', {
//     tms: true,
//     attribution: 'Your attribution',
//     maxZoom: 12
//   });
  
//   var tsnowLayer_swe = L.tileLayer('SNODAS_SWE_311221/{z}/{x}/{y}.png', {
//     tms: true,
//     attribution: 'Your attribution',
//     maxZoom: 12
//   });
//   SnowMaps = [
//     { 
//       groupName : "Snow Maps",
//       expanded : true,
//       exclusive: true,
//       layers    : {
//         "Depth": tsnowLayer,
//       "SWE": tsnowLayer_swe,
     
//       }
//     }							
//   ];	
//   streets.addTo(map);
//   // tsnowLayer.addTo(map);
//   console.log(baseMaps);
//   control = L.Control.styledLayerControl(baseMaps, SnowMaps, options).addTo(map);
  
  


// }

// Initialize jQuery UI Datepicker widget
$(function() {
  $("#datepicker").datepicker({
    dateFormat: 'yy-mm-dd',
    onSelect: function(dateText) {
      // Call the function to update SWE and Depth layers based on the selected date
      updateSnowLayers(dateText);
    }
  });
});


