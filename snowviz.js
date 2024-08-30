
var active_layers = {};
var dft,imagery,topographic,terrain,ps_daily;
var SWE, DEPTH, asu_snow;
var ps_daily_url;
// var cogs;
// var legend;






var circle;
// var olayers = {};

var SNOTELCustomID = 'SNOTEL';

var SNOTEL;
var WB_HU2,WB_HU6,WB_HU4,WB_HU8,bvc_region;
var currentDate = new Date();

// Get the current day (0-6, where 0 represents Sunday)
var currentDay = currentDate.getDate();

// Get the current month (0-11, where 0 represents January)
var currentMonth = currentDate.getMonth() + 1; // Adding 1 to get 1-12 format

// Get the current year (4 digits)
var currentYear = currentDate.getFullYear();

define_basemaps("2024-04-01");
define_snowmaps("2024-04-01");
var base_layer;
base_layer = L.tileLayer('https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2024_07_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK167d2e657cfb45bc816f8a79c651aee8', {
  maxZoom: 19,
  attribution: 'Imagery &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  className: 'blurred-tile' // Add the CSS class here

});
// Create map instance
var map = L.map('map', {
  layers: [base_layer],
  zoomControl: false // Default basemap layer
}).setView([34.9133, -111.5589], 11);


L.control.zoom({
  position: 'topright'
}).addTo(map);
// 34.0489° N, 111.0937° W
map.createPane('points');
map.getPane('points').style.zIndex = 10000;
map.createPane('bubbles');
map.getPane('bubbles').style.zIndex = 20000;
define_overlays();

// legends();
var legend_swe = legends(map,'SWE');
var legend_depth = legends(map,'DEPTH');
var legend_asu_snow = legends(map,'asu_snow');
var legend_ps = legends2(map,planet_url,'biweekly');
var legend_ps_daily = legends2(map,planet_url_d,'daily');


var baseMaps = [
  { 
    groupName : "Base Maps",
    expanded : false  ,
    layers    : {
      "Default": dft,
    "Bi-Weekly Mosaic": imagery,
    // "cogs":cogs,
    "PlanetScope": ps_daily,
    
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
        "No Layer":L.tileLayer(''),
        "SNODAS DEPTH": DEPTH,
      "SWANN SWE": SWE,
      "ASU Snow Product": asu_snow,
     
      }
    },
    { 
      groupName : "Overlays",
      expanded : false,
      exclusive: false,
      layers    : {
        "SNOTEL":SNOTEL,
        "WB_HU2":WB_HU2,
        "WB_HU4":WB_HU4,
        "WB_HU6":WB_HU6,
        "WB_HU8":WB_HU8,
        
      }
    }									
  ];
var tileLayerContainer;
var control = L.Control.styledLayerControl(baseMaps, SnowMaps, options).addTo(map);
var aboundary = aboundary('arizona.geojson','arizona');
aboundary.addTo(map);
// displayGeoJsonText('cities_points_8858038672257363236.geojson');
  // Function to update the SWE and Depth layers based on the selected date
function updateSnowLayers(date) {
  console.log('map',map);
  var active_layers_copy = {...active_layers};
  map.eachLayer(function(layer_1) {
    
    map.removeLayer(layer_1);
    
});

base_layer.addTo(map);
aboundary.addTo(map);

tileLayerContainer = document.querySelector('.blurred-tile');
console.log(document.querySelector('.blurred-tile'));
if (tileLayerContainer) {
  // console.log('xw');
  tileLayerContainer.style.filter = `blur(0px)`;
}
// console.log('a',legend);
  // Remove existing layers from SnowMaps array
  map.removeControl(control);
  map.removeControl(legend_ps);
  map.removeControl(legend_ps_daily);
  

  update_basemaps(date);
  define_snowmaps(date);
  // define_overlays();
  legend_ps = legends2(map,planet_url,'biweekly');
  legend_ps_daily = legends2(map,planet_url_d,'daily');
  

  baseMaps = [
    { 
      groupName : "Base Maps",
      expanded : false  ,
      layers    : {
        "Default": dft,
      "Bi-Weekly Mosaic": imagery,
      // "cogs":cogs,
      "PlanetScope": ps_daily,
   
      }
    }							
  ];	
  SnowMaps = [
    { 
      groupName : "Snow Maps",
      expanded : true,
      exclusive: true,
      layers    : {
        "No Layer":L.tileLayer(''),
        "SNODAS DEPTH": DEPTH,
      "SWANN SWE": SWE,
      "ASU Snow Product": asu_snow,
     
      }
    },
    { 
      groupName : "Overlays",
      expanded : false,
      exclusive: false,
      layers    : {
        
        "SNOTEL":SNOTEL,
        "WB_HU2":WB_HU2,
        "WB_HU4":WB_HU4,
        "WB_HU6":WB_HU6,
        "WB_HU8":WB_HU8,
        
      }
    }									
  ];	
  for (const [key, value] of Object.entries(baseMaps[0].layers)) {
    if(active_layers_copy[value.name]==true){
    value.addTo(map);  
    if(value.name=='Imagery'){

        legend_ps.addTo(map);
      }
      if(value.name=='PlanetScope'){
        if (tileLayerContainer) {
          // console.log('xw');
          tileLayerContainer.style.filter = `blur(2px)`;
        }
        bvc_region.addTo(map);
        legend_ps_daily.addTo(map);
      }
    }
  }
  for (const [key, value] of Object.entries(SnowMaps[0].layers)) {
    if(active_layers_copy[value.name]==true){
      console.log(value.name);
      value.addTo(map);
      if(value.name=='SWE'){
        legend_swe.addTo(map);
      }
      if(value.name=='DEPTH'){
        legend_depth.addTo(map);
      }
      if(value.name=='asu_snow'){
        legend_asu_snow.addTo(map);
      }
    }
  }
  for (const [key, value] of Object.entries(SnowMaps[1].layers)) {
    if(active_layers_copy[value.name]==true){
      // console.log('xreac',value);
      value.addTo(map);
    }
  }
  
  active_layers = active_layers_copy;
  control = L.Control.styledLayerControl(baseMaps, SnowMaps, options).addTo(map);
  

}
console.log('av',map);
map.on('baselayerchange', function(e) {
  

  for (const [key, value] of Object.entries(baseMaps[0].layers)) {
    active_layers[value.name] = false;
    }
  
  active_layers[e.layer.name] = true;
  if(e.layer.name=='Imagery'){
    legend_ps.addTo(map);
    map.removeControl(legend_ps_daily);
    map.removeControl(bvc_region);
  }
  else if(e.layer.name=='PlanetScope'){
    bvc_region.addTo(map);
    legend_ps_daily.addTo(map);
    map.removeControl(legend_ps);
  }
  else{
    map.removeControl(legend_ps);
    map.removeControl(legend_ps_daily);
    map.removeControl(bvc_region);
    legend_ps = legends2(map,planet_url,'biweekly');
    legend_ps_daily = legends2(map,planet_url_d,'daily');
    
  }
});

map.on('overlayadd', function(e) {
  console.log('added',e);
  active_layers[e.layer.name] = true;
  if(e.layer.name=='SWE'){
    legend_swe.addTo(map);
  }
  if(e.layer.name=='DEPTH'){
    legend_depth.addTo(map);
  }
  if(e.layer.name=='asu_snow'){
    legend_asu_snow.addTo(map);
  }
  console.log(active_layers);

  
});
map.on('overlayremove', function(e) {
  console.log('remove',e);
  active_layers[e.layer.name] = false;

  if(e.layer.name=='SWE'){
    map.removeControl(legend_swe);
    legend_swe = legends(map,'SWE');
  }
  if(e.layer.name=='DEPTH'){
    map.removeControl(legend_depth);
    legend_depth = legends(map,'DEPTH');
  }
  if(e.layer.name=='asu_snow'){
    map.removeControl(legend_asu_snow);
    legend_asu_snow = legends(map,'asu_snow');
  }
});


var availDates;
var availDatesPlanet, ps_date, asu_snow_date;

$(document).ready(function() {
    // Function to fetch and process the list of dates
    function fetchDatesList() {
        $.ajax({
            url: 'dates_list.txt',
            dataType: 'text',
            success: function(data) {
                // Split the data into an array of dates
                availDates = data.split('\n').filter(Boolean); // Remove empty elements
                // console.log(availDates);

                // Print the list of dates
                // console.log("Dates List:");
                // availDates.forEach(function(date) {
                //     console.log(date);
                // });

                // You can now use availDates as needed in your JavaScript code
            },
            error: function(xhr, status, error) {
                console.error('Error loading file:', error);
            }
        });
    }

    // Call the fetchDatesList function on page load
    fetchDatesList();

    
});



function unavailable(date) {
  
  // console.log('reac');
  if(active_layers['asu_snow']==true){
    const dateObj = new Date(date);
    const formattedDateStr = dateObj.toISOString().split('T')[0];
    if ($.inArray(formattedDateStr, asu_snow_date) != -1) {
        return [true, ""];
    } else {
        return [false, "", "Unavailable"];
    }

  }
  if(active_layers['PlanetScope']==true){
    const dateObj = new Date(date);
    const formattedDateStr = dateObj.toISOString().split('T')[0];
    if ($.inArray(formattedDateStr, ps_date) != -1) {
        return [true, ""];
    } else {
        return [false, "", "Unavailable"];
    }

  }
  if(active_layers['DEPTH']==true){
    
    dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    if ($.inArray(dmy, availDates) != -1) {
        return [true, ""];
    } else {
        return [false, "", "Unavailable"];
    }

  }
  else{

    dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  // console.log(dmy);
  if ( date.getFullYear() <= 2023 && date.getMonth()<9 || (date.getFullYear()>=currentYear && (date.getMonth()+1)>=currentMonth && date.getDate()>1 )) {
    return [false, "", "Unavailable"];
}
else{
  return [true, ""];
}
  }
  
}

// var unavailableDates = ["24-3-2024", "23-3-2024", "22-3-2024"];
//old
    // function unavailable(date) {
    //     dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    //     // console.log(dmy);
    //     if ( date.getFullYear() < 2023) {
    //       return [false, "", "Unavailable"];
    //   }
    //     if ($.inArray(dmy, availDates) != -1) {
    //         return [true, ""];
    //     } else {
    //         return [false, "", "Unavailable"];
    //     }
    // }
// Initialize jQuery UI Datepicker widget
$(function() {
  $("#datepicker").datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
      changeYear: true,
    beforeShowDay: unavailable,
    onSelect: function(dateText) {
      // Call the function to update SWE and Depth layers based on the selected date
      updateSnowLayers(dateText);
      setTimeout(() => {
        $(this).datepicker("show");
      }, 0); 
    }
  });
  
  
});

// legend.addTo(map);
L.control.scale().addTo(map);



