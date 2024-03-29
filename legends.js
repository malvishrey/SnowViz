function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
  }
  
  function legends(map,type){
    
    var legend = L.control({position: 'bottomleft'});
    
    legend.onAdd = function (map) {
    
        var containerDiv = L.DomUtil.create('div', 'legend-container');
    containerDiv.style.backgroundColor = '#ffffff'; // Set white background color
    containerDiv.style.width = '250px'; // Set width to 200 pixels
    containerDiv.style.height = '50px'; // Set height to 100 pixels
    
    var img = document.createElement('img');
    if(type=='SWE'){
    img.src = '2.png'; // Set the source of your image
  }else{
    img.src = 'ts2.png';
  }
    img.style.display = 'block';
    img.style.margin = 'auto';
    img.style.width = '90%'; // Adjust the width of the image as needed
    img.style.height = '100%'; // Adjust the height of the image as needed
    
    containerDiv.appendChild(img); // Append the image to the container div
    return containerDiv;
    };
  return legend;
  
  }


//   function legends(map){
    
//     legend = L.control({position: 'bottomleft'});
    
//     legend.onAdd = function (map) {
    
//         var div = L.DomUtil.create('div', 'info legend'),
//             grades = [0, 1, 2, 5, 10, 50, 100],
//             labels = [];
    
//         // Loop through our density intervals and generate a label with a colored square and tick for each interval
//         for (var i = 0; i < grades.length; i++) {
//             var from = grades[i];
    
//             div.innerHTML +=
//                 '<div style="display: inline-block; position: relative;">' +
//                 '<div style="width: 15px; height: 15px; background: ' + getColor(from + 1) + ';"></div>' +
//                 '<div style=" font-size: 8px;">' + from + '</div>' +
//                 '</div>';
//         }
    
//         // Add some bottom margin to separate from the map
//         div.style.marginBottom = '20px';
    
//         return div;
//     };
  
  
//   }