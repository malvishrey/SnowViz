function extract(url_temp){
  // Regular expression to match the date pattern in the URL
const datePattern = /(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})/;

// Extracting the date range from the URL
const matches = url_temp.match(datePattern);

if (matches && matches.length >= 3) {
    const startDate = matches[1]; // Extracted start date
    const endDate = matches[2]; // Extracted end date
    return startDate + ' to ' + endDate; 
} else {
    return '';
}

}
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
        containerDiv.style.backgroundColor = '#ffffff'; // Set subtle background color
        containerDiv.style.border = '1px solid #ccc'; // Add border
        containerDiv.style.borderRadius = '8px'; // Make edges rounded
        containerDiv.style.padding = '5px'; // Add padding
    containerDiv.style.width = '300px'; // Set width to 200 pixels
    containerDiv.style.height = '80px'; // Set height to 100 pixels
    
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

  function legends2(map, text) {
    text = extract(text);
    
    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (map) {
        var containerDiv = L.DomUtil.create('div', 'legend-container');
        
        // Set styles for the container
        containerDiv.style.backgroundColor = '#f9f9f9'; // Set subtle background color
        containerDiv.style.border = '1px solid #ccc'; // Add border
        containerDiv.style.borderRadius = '8px'; // Make edges rounded
        containerDiv.style.padding = '12px 0px 12px 0px'; // Add padding
        containerDiv.style.width = '300px'; // Set width to 50 pixels (80% reduction)
        // containerDiv.style.height = 'auto'; // Set height to auto
        // containerDiv.style.padding_top = '10px';
        
        var textElement = document.createElement('p'); // Create a paragraph element
        textElement.innerHTML = '<b>Planet Imagery - Biweekly</b><br>' +text +' (Regional)'; // Set the text content with line breaks
        textElement.style.textAlign = 'center'; // Set text alignment to center
        textElement.style.margin = '0'; // Remove any default margin
        textElement.style.lineHeight = '1.2'; // Set line height
        textElement.style.width = '100%'; // Set width to 100% to fill the container
        textElement.style.fontFamily = 'Ubuntu-Regular, sans-serif'; // Set font family
        textElement.style.fontSize = '15px'; // Set font size to 10 pixels (80% reduction)
        textElement.style.color = '#333'; // Set font color
        
        containerDiv.appendChild(textElement); // Append the text element to the container div
        return containerDiv;
    };
    
    return legend;
}
