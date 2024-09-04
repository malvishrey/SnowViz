function formatDateShort(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
function formatDateRange(startDateStr, endDateStr) {
  // Convert string inputs to Date objects
  const startDate = new Date(startDateStr+ 'T00:00:00-07:00');
  const endDate = endDateStr ? new Date(endDateStr+ 'T00:00:00-07:00') : null;

  if (endDate) {
      // Format both start and end dates and combine them into a range
      const startStr = formatDateShort(startDate);
      const endStr = formatDateShort(endDate);
      return `${startStr} to ${endStr}`;
  } else {
      // Format only the start date
      return formatDateShort(startDate);
  }
}

function generateBiweeklyEndDates() {
  const startDate = new Date('2022-12-26'); // Initial start date
  const currentDate = new Date();
  const startDates = [];

  let date = new Date(startDate);

  while (date <= currentDate) {
      // Add the start date to the list
      startDates.push(date.toISOString().split('T')[0]);

      // Move to the next biweekly period
      date.setDate(date.getDate() + 14); // Increment by 14 days
  }
  startDates.reverse();

  // Print all the start dates
  console.log('Biweekly Start Dates:');
  startDates.forEach(date => console.log(date));
  

  return startDates;
}

// Call the function
availDatesPlanet = generateBiweeklyEndDates();
console.log(availDatesPlanet);
var ps_daily_map;
function fetchDatesList_ps_daily() {
  $.ajax({
      url: 'ps_daily.txt',
      dataType: 'text',
      async: false,
      success: function(data) {
          // Split the data into an array of dates
          ps_date = data.split('\n').filter(Boolean); // Remove empty elements

          // Print the list of dates
          // console.log("Dates List:");
          // availDates.forEach(function(date) {
          //     console.log(date);
          // });
          // console.log('re');
          // You can now use availDates as needed in your JavaScript code
      },
      error: function(xhr, status, error) {
          console.error('Error loading file:', error);
      }
  });
}
fetchDatesList_ps_daily();
// console.log(ps_daily_map);

function fetchDatesList_asu_snow() {
  $.ajax({
      url: 'asu_snow_dates.txt',
      dataType: 'text',
      async: false,
      success: function(data) {
          // Split the data into an array of dates
          asu_snow_date = data.split('\n').filter(Boolean); // Remove empty elements

          // Print the list of dates
          // console.log("Dates List:");
          // availDates.forEach(function(date) {
          //     console.log(date);
          // });
          // console.log('re');
          // You can now use availDates as needed in your JavaScript code
      },
      error: function(xhr, status, error) {
          console.error('Error loading file:', error);
      }
  });
}
fetchDatesList_asu_snow();
// console.log('asu_snow',asu_snow_date);

// Call the fetchDatesList function on page load
// fetchDatesListP();
function get_date(referenceDateString){
  
  // const referenceDateString = '2024-04-05';
// console.log('x',availDatesPlanet);
// Convert date strings to Date objects
const dates = availDatesPlanet.map(dateStr => new Date(dateStr));
const referenceDate = new Date(referenceDateString);

// Filter dates smaller than the reference date
const pastDates = dates.filter(date => date < referenceDate);

// Find the greatest date smaller than the reference date
let greatestDate = pastDates.reduce((prev, curr) => {
    return prev > curr ? prev : curr;
});

var index = availDatesPlanet.findIndex(dateStr => dateStr === greatestDate.toISOString().split('T')[0]);

if(index==0){
  index = 1;
}
// Get the index of the greatest date in the original array
console.log(availDatesPlanet[index],availDatesPlanet[index-1]);
return availDatesPlanet[index]+'_'+availDatesPlanet[index-1];
}

var biweekly_label,daily_label;
var planet_url;
biweekly_label = 'Not found';
daily_label = 'Not found';
async function define_basemaps(date){

  dft = L.tileLayer('');
    dft.name = 'dft';
    if(!('dft' in active_layers))
      active_layers['dft'] = true;
    
    if(date==null){
      planet_url = 'https://tiles3.planet.com/basemaps/v1/planet-tiles/ps_biweekly_visual_subscription_2024-03-18_2024-04-01_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK167d2e657cfb45bc816f8a79c651aee8';
  }else{
    try{
    var new_date  = get_date(date);
    const [startDateStr, endDateStr] = new_date.split('_');
    // planet_url = 'https://tiles3.planet.com/basemaps/v1/planet-tiles/ps_biweekly_visual_subscription_2024-03-18_2024-04-01_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK167d2e657cfb45bc816f8a79c651aee8';
    planet_url = 'https://tiles3.planet.com/basemaps/v1/planet-tiles/ps_biweekly_visual_subscription_'+new_date+'_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK167d2e657cfb45bc816f8a79c651aee8';
    biweekly_label = formatDateRange(startDateStr,endDateStr);
    imagery = L.tileLayer(planet_url, {
      maxZoom: 19,
      attribution: 'Imagery &copy; <a href="https://www.planet.com/">2023 Planet Labs PBC</a> contributors'
    });
    imagery.name = 'Imagery';
    if(!('Imagery' in active_layers))
      active_layers['Imagery'] = false;
    // console.log('valid bik');
    }
    catch (error) {
      // Handle any errors that occur in the try block
      imagery.name = 'Imagery';
      console.error("date not found for ps bi-weekly");
      
      active_layers['Imagery'] = false;
  }
  }
  



  
    console.log('date',date);
    // ps_daily_url = ps_daily_map[date];
    // var ps_daily_url  = ps_daily_url+'.png?api_key=PLAK167d2e657cfb45bc816f8a79c651aee8';
    daily_label = formatDateRange(date);
    date = date.replace(/-/g, '');
    ps_daily_url = 'https://storage.googleapis.com/shrey-snowviz-platform/data/planet_daily/'+date+'/{z}/{x}/{y}.png';
    // ps_daily_url = '/Users/kakashi/Desktop/PlanetViz/svr_tile_test/{z}/{x}/{y}.png';

    // ps_daily = L.tileLayer(ps_daily_url, {
    //   minNativeZoom: 8,
    //   maxNativeZoom: 15,
    //   attribution: 'Imagery &copy; <a href="https://www.planet.com/">2023 Planet Labs PBC</a> contributors'
    // });
    ps_daily = L.tileLayer(ps_daily_url, {
      tms: true,
      attribution: 'PlanetScope',
      minNativeZoom: 0,
      maxNativeZoom: 23,
      // nativeZooms: [2, 7]
    });
    ps_daily.name = 'PlanetScope';
    if(!('PlanetScope' in active_layers))
      active_layers['PlanetScope'] = false;
    
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
      swe_url = 'https://storage.googleapis.com/shrey-snowviz-platform/data/SWANN/SWANN_SWE_' + date + '/{z}/{x}/{y}.png';
      depth_url = 'https://storage.googleapis.com/shrey-snowviz-platform/data/SNODAS/SNODAS_DEPTH_'+'2021'+date.slice(4)+'/{z}/{x}/{y}.png';
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

    // asu_snow_url = 'data/asu_snow/'+date+'/{z}/{x}/{y}.png';
    asu_snow_url = 'https://storage.googleapis.com/shrey-snowviz-platform/data/asu_snow/' + date + '/{z}/{x}/{y}.png';

    // asu_snow_url = 'data/preds/snow_pred/{z}/{x}/{y}.png';
    asu_snow = L.tileLayer(asu_snow_url, {
      tms: true,
      attribution: 'Shrey Malvi',
      minNativeZoom:0,
      opacity:0.6,

      // maxZoom: 20,
      maxNativeZoom: 23,
      // nativeZooms: [2, 20]
    });
    asu_snow.name = 'asu_snow';
    if(!('asu_snow' in active_layers))
      active_layers['asu_snow'] = false;


  }

  function displayGeoJsonText(filename) {
    // var map = L.map('map').setView([51.505, -0.09], 13);

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);

    var geojsonLayer = new L.geoJson();

    $.ajax({
        url: filename,
        beforeSend: function(xhr) {
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType("application/json");
            }
        },
        dataType: "json",
        success: function(data) {
            var markers = [];

            $(data.features).each(function(key, feature) {
                var layer = L.geoJson(feature);
                var coords;

                if (layer.getLayers()[0] instanceof L.Marker) {
                    coords = layer.getLayers()[0].getLatLng();
                } else if (layer.getLayers()[0] instanceof L.Polygon || layer.getLayers()[0] instanceof L.Polyline) {
                    coords = layer.getLayers()[0].getBounds().getCenter();
                } else {
                    coords = layer.getLayers()[0].getLatLng();
                }

                var marker = L.marker(coords, {
                    icon: L.divIcon({
                        className: 'geojson-label',
                        html: feature.properties.NAME,
                        iconSize: [100, 40] // Default size, will be overridden dynamically
                    })
                }).addTo(map);

                markers.push(marker);
            });

            // Function to handle zoom changes
            function updateLabelFontSize() {
                var zoom = map.getZoom();
                var fontSize = Math.max(0, zoom * 0.2) + 'px'; // Adjust font size calculation as needed
                markers.forEach(function(marker) {
                    var icon = marker.getIcon();
                    icon.options.html = '<div class="geojson-label" style="font-size: ' + fontSize + ';">' + marker.options.icon.options.html + '</div>';
                    marker.setIcon(icon);
                });
            }

            map.on('zoomend', updateLabelFontSize);
            updateLabelFontSize(); // Initial check
        }
    });
}

function aboundary(watershedGeoJSONFile,ws) {
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
                  "fillOpacity": 0.0,
                  "weight":1,
                  
                  "color":"white"
              });
          });
      }
  });
  return watershed_boundary;
} 
// var aboundary
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
                    "fillOpacity": 0.0
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

    bvc_region = addWatershedBoundary('data/huc10_bvc.geojson','BVC');
    bvc_region.name = 'BVC';

    roads = L.tileLayer('https://mt{s}.google.com/vt/lyrs=h&x={x}&y={y}&z={z}', {
      // tms: true,
      attribution: 'Google',
      minNativeZoom: 0,
      maxNativeZoom: 23,
      subdomains: '123',
      // hq: L.Browser.retina,
  
      // hq: L.Browser.retina,
      // nativeZooms: [2, 7]
    });
    roads.name = 'roads';
    if(!('roads' in active_layers))
        active_layers['roads'] = true;

//     var arizonaCitiesLayer = addArizonaCity('cities_points_8858038672257363236.geojson', 'arizonaCityLayer',map);
// arizonaCitiesLayer.addTo(map);  // Add the layer to the Leaflet map instance

  //   bvc_region.setStyle({
  //     "fillOpacity": 0.0
  // });
    // if(!('BVC' in active_layers))
    //     active_layers['BVC'] = false;

}