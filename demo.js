
var active_layers = {};
var streets,imagery,topographic,terrain;
var SWE, DEPTH;

function define_basemaps(){

  streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  });
  streets.name = 'Streets';
  if(!('Streets' in active_layers))
    active_layers['Streets'] = true;

  imagery = L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Imagery &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  });
  imagery.name = 'Imagery';
  if(!('Imagery' in active_layers))
    active_layers['Imagery'] = false;

  topographic = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  });
  topographic.name = 'Topographic';
  if(!('Topographic' in active_layers))
    active_layers['Topographic'] = false;

  terrain = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}', {
      maxZoom: 22,
      attribution: 'Map data &copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors'
  });
  terrain.name = 'Terrain';
  if(!('Terrain' in active_layers))
    active_layers['Terrain'] = false;

}

function define_snowmaps(date){
  console.log(date);
  if(date ==null || date =='2024-03-22'){
    swe_url = 'img100_swe_2/{z}/{x}/{y}.png';
    depth_url = 'img100/{z}/{x}/{y}.png';
  }
  else{
    swe_url = 'SNODAS_SWE_301221/{z}/{x}/{y}.png';
    depth_url = 'SNODAS_SWE_311221/{z}/{x}/{y}.png';
  }
  SWE = L.tileLayer(swe_url, {
    tms: true,
    attribution: 'Your attribution',
    // maxZoom: 12
    maxNativeZoom: 7,
    // nativeZooms: [2, 7]
  });
  SWE.name = 'SWE';
  if(!('SWE' in active_layers))
    active_layers['SWE'] = false;
  
  DEPTH = L.tileLayer(depth_url, {
    tms: true,
    attribution: 'Your attribution',
    maxNativeZoom: 7,
    // nativeZooms: [2, 7]
  });
  DEPTH.name = 'DEPTH';
  if(!('DEPTH' in active_layers))
    active_layers['DEPTH'] = false;
}

var circle;
var olayers = {};

var circleLayerCustomID = 'myCircleLayer';

var circleLayer = L.layerGroup();
circleLayer._leaflet_id = circleLayerCustomID; 

// Create a hashmap for station IDs
var stationHashMap = {};

// Parse CSV file
Papa.parse('az_snotel.csv', {
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
      


      var popup = L.popup();

      var photoImg = '<img src="output_image.png" height="150px" width="150px"/>';

          popup.setContent("<center> Station Id: " +stationId+" </center>" + "</br>"+ photoImg);
          circle.bindTooltip("<center>Station Id: "  +stationId+" </center>" + "</br>"+ photoImg);
          // circle.bindPopup(popup).openPopup();


     

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
olayers['WB_HU4'] = addWatershedBoundary('wbdhu4_salt.geojson','WB_HU4');
olayers['WB_HU6'] = addWatershedBoundary('output.geojson','WB_HU6');
olayers['WB_HU10'] = addWatershedBoundary('output10.geojson','WB_HU10');


define_basemaps();
define_snowmaps(null);

// Create map instance
var map = L.map('map', {
  layers: [streets] // Default basemap layer
}).setView([34.43854, -111.39367995967369], 7);


var baseMaps = [
  { 
    groupName : "Base Maps",
    expanded : false  ,
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
};




// console.log(olayers);
var SnowMaps = [
    { 
      groupName : "Snow Maps",
      expanded : true,
      exclusive: true,
      layers    : {
        "DEPTH": DEPTH,
      "SWE": SWE,
     
      }
    },
    { 
      groupName : "Overlays",
      expanded : false,
      exclusive: false,
      layers    : olayers
    }									
  ];
var control = L.Control.styledLayerControl(baseMaps, SnowMaps, options).addTo(map);
  
  // Function to update the SWE and Depth layers based on the selected date
function updateSnowLayers(date) {
  var active_layers_copy = {...active_layers};
  map.eachLayer(function(layer_1) {
    
    map.removeLayer(layer_1);
});
  // Remove existing layers from SnowMaps array
  map.removeControl(control);

  define_basemaps();
  define_snowmaps(date);

  baseMaps = [
    { 
      groupName : "Base Maps",
      expanded : false  ,
      layers    : {
        "Streets": streets,
      "Imagery": imagery,
      "Topographic": topographic,
      "Terrain": terrain
      }
    }							
  ];	
  SnowMaps = [
    { 
      groupName : "Snow Maps",
      expanded : true,
      exclusive: true,
      layers    : {
        "DEPTH": DEPTH,
      "SWE": SWE,
     
      }
    }							
  ];	
  for (const [key, value] of Object.entries(baseMaps[0].layers)) {
    if(active_layers_copy[value.name]==true){
      console.log(value.name);
      value.addTo(map);
    }
  }
  for (const [key, value] of Object.entries(SnowMaps[0].layers)) {
    if(active_layers_copy[value.name]==true){
      console.log(value.name);
      value.addTo(map);
    }
  }
  active_layers = active_layers_copy;
  // for (const [key, value] of Object.entries(baseMaps[1].layers)) {
  //   if(active_layers[value.name]==true){
  //     value.addTo(map);
  //   }
  // }
  // streets.addTo(map);
  // // tsnowLayer.addTo(map);
  
  // tsnowLayer.addTo(map);
  control = L.Control.styledLayerControl(baseMaps, SnowMaps, options).addTo(map);
  
  


}
console.log('av',map);
map.on('baselayerchange', function(e) {
  

  for (const [key, value] of Object.entries(baseMaps[0].layers)) {
    active_layers[value.name] = false;
    }
  
  active_layers[e.layer.name] = true;
  console.log(e);
});

map.on('overlayadd', function(e) {
  console.log('added',e);
  active_layers[e.layer.name] = true;
});
map.on('overlayremove', function(e) {
  console.log('remove',e);
  active_layers[e.layer.name] = false;
});
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


