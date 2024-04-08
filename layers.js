function fetchDatesListP() {
  $.ajax({
      url: 'dates_list_planet.txt',
      dataType: 'text',
      async: false,
      success: function(data) {
          // Split the data into an array of dates
          availDatesPlanet = data.split('\n').filter(Boolean); // Remove empty elements

          // Print the list of dates
          // console.log("Dates List:");
          // availDates.forEach(function(date) {
          //     console.log(date);
          // });
          console.log('re');
          // You can now use availDates as needed in your JavaScript code
      },
      error: function(xhr, status, error) {
          console.error('Error loading file:', error);
      }
  });
}

// Call the fetchDatesList function on page load
fetchDatesListP();
function get_date(referenceDateString){
  
  // const referenceDateString = '2024-04-05';
console.log('x',availDatesPlanet);
// Convert date strings to Date objects
const dates = availDatesPlanet.map(dateStr => new Date(dateStr));
const referenceDate = new Date(referenceDateString);

// Filter dates smaller than the reference date
const pastDates = dates.filter(date => date < referenceDate);

// Find the greatest date smaller than the reference date
let greatestDate = pastDates.reduce((prev, curr) => {
    return prev > curr ? prev : curr;
});
const index = availDatesPlanet.findIndex(dateStr => dateStr === greatestDate.toISOString().split('T')[0]);

// Get the index of the greatest date in the original array
console.log(availDatesPlanet[index],availDatesPlanet[index-1]);
return availDatesPlanet[index]+'_'+availDatesPlanet[index-1];
}
var planet_url;
function define_basemaps(date){

    streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Imagery &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    });
    streets.name = 'Streets';
    if(!('Streets' in active_layers))
      active_layers['Streets'] = true;
    
    if(date==null){
      planet_url = 'https://tiles3.planet.com/basemaps/v1/planet-tiles/ps_biweekly_visual_subscription_2024-03-18_2024-04-01_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK167d2e657cfb45bc816f8a79c651aee8';
  }else{
    var new_date  = get_date(date);

    planet_url = 'https://tiles3.planet.com/basemaps/v1/planet-tiles/ps_biweekly_visual_subscription_'+new_date+'_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK167d2e657cfb45bc816f8a79c651aee8';
  }
  imagery = L.tileLayer(planet_url, {
        maxZoom: 19,
        attribution: 'Imagery &copy; <a href="https://www.planet.com/">2023 Planet Labs PBC</a> contributors'
    });
    imagery.name = 'Imagery';
    if(!('Imagery' in active_layers))
      active_layers['Imagery'] = false;

    topographic = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Imagery &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    });
    topographic.name = 'Topographic';
    if(!('Topographic' in active_layers))
      active_layers['Topographic'] = false;
  
    terrain = L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 22,
        attribution: 'Imagery &copy; <a href="https://esri.com">ESRI</a> contributors'
    });
    terrain.name = 'Terrain';
    if(!('Terrain' in active_layers))
      active_layers['Terrain'] = false;
  
  }
  
  function define_snowmaps(date){
    
    if(date ==null){
      swe_url = 'data/SNODAS/img100_swe_2/{z}/{x}/{y}.png';
      depth_url = 'data/SNODAS/img100/{z}/{x}/{y}.png';
    }
    else{
    //   console.log(date.replace(/-/g, ''));
      date = date.replace(/-/g, '');
      // date = '2021'+date.slice(4);
      // console.log()    
      swe_url = 'data/SWANN/SWANN_SWE_'+date+'/{z}/{x}/{y}.png';
      depth_url = 'data/SNODAS/SNODAS_DEPTH_'+'2021'+date.slice(4)+'/{z}/{x}/{y}.png';
    }
    SWE = L.tileLayer(swe_url, {
      tms: true,
      attribution: 'Shrey Malvi',
      // maxZoom: 12
      maxNativeZoom: 7,
      // nativeZooms: [2, 7]
    });
    SWE.name = 'SWE';
    if(!('SWE' in active_layers))
      active_layers['SWE'] = false;
    
    DEPTH = L.tileLayer(depth_url, {
      tms: true,
      attribution: 'Shrey Malvi',
      maxNativeZoom: 7,
      // nativeZooms: [2, 7]
    });
    DEPTH.name = 'DEPTH';
    if(!('DEPTH' in active_layers))
      active_layers['DEPTH'] = false;
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


  function define_overlays(){
    SNOTEL = L.layerGroup();
    SNOTEL._leaflet_id = SNOTELCustomID; 

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
            radius: 500, // Initial radius in meters
            pane: 'points'
            };
    
            // Create circle
            var circle = L.circle([lat, lng], circleOptions);
            
    
    
            var popup = L.popup();
    
            var photoImg = '<img src="data/SNOTEL/output_image.png" height="150px" width="150px"/>';
    
                // popup.setContent("<center> Station Id: " +row['Station Id']
                // +" </center></br><center>" +row['Station Name']+"</center></br>"+photoImg);
                // circle.bindTooltip("<center>Station Id: "  +stationId+" </center>" + "</br>"+ photoImg);
                circle.bindTooltip("<center> Station Id: " +row['Station Id'] + " (" + row['Latitude']+","+row['Longitude']+")"
                +" </center><center> Name: " +row['Station Name']+"</center><center> Elevation: "+row['Elevation']+"</center></br><center>"+photoImg, {
                    pane: 'bubbles',
                    autoPan: false
                });
    
            circle.addTo(SNOTEL);
        
    
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
            // stationHashMap[stationId] = circle;
        });
        }
    });
  
    SNOTEL.name = 'SNOTEL';
    // SNOTEL.setZIndex(1000);
    if(!('SNOTEL' in active_layers))
      active_layers['SNOTEL'] = false;
  
//   olayers['SNOTEL'] = SNOTEL;
  
//   // Function to retrieve circle by station ID
//   function getCircleByStationId(stationId) {
//     return stationHashMap[stationId];
//   }
  
  
    WB_HU2 = addWatershedBoundary('data/WBD/output2.geojson','WB_HU2');
    WB_HU2.name = 'WB_HU2';
    
    if(!('WB_HU2' in active_layers))
        active_layers['WB_HU2'] = false;
  
    WB_HU4 = addWatershedBoundary('data/WBD/output4.geojson','WB_HU4');
    WB_HU4.name = 'WB_HU4';
    if(!('WB_HU4' in active_layers))
        active_layers['WB_HU4'] = false;

    WB_HU6 = addWatershedBoundary('data/WBD/output6.geojson','WB_HU6');
    WB_HU6.name = 'WB_HU6';
    if(!('WB_HU6' in active_layers))
        active_layers['WB_HU6'] = false;

    WB_HU8 = addWatershedBoundary('data/WBD/output8.geojson','WB_HU8');
    WB_HU8.name = 'WB_HU8';
    if(!('WB_HU8' in active_layers))
        active_layers['WB_HU8'] = false;

}