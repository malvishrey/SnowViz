var active_layers = {};
var streets, imagery, topographic, terrain, cog;
var SWE, DEPTH;
var SNOTEL, WB_HU2, WB_HU4, WB_HU6, WB_HU8;
var legend_swe, legend_depth, legend_ps;
var map, control;
var baseMaps, SnowMaps;
var availDates;
var SNOTELCustomID = 'SNOTEL';

var options = {
    container_width: "250px",
    container_maxHeight: "300px",
    group_maxHeight: "80px",
    exclusive: false,
};

// Initialize the map and controls
async function initializeMap(date) {
    map = L.map('map', {
        zoomControl: false
    }).setView([34.0489, -111.0937], 6);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    map.createPane('points').style.zIndex = 10000;
    map.createPane('bubbles').style.zIndex = 20000;

    // Load base maps synchronously
    await loadBaseMaps(date);

    define_snowmaps(date);
    define_overlays();
    streets.addTo(map);

    // Add the legends
    legend_swe = legends(map, 'SWE');
    legend_depth = legends(map, 'DEPTH');
    legend_ps = legends2(map, planet_url);

    setupLayerControls();

    map.on('baselayerchange', handleBaseLayerChange);
    map.on('overlayadd', handleOverlayAdd);
    map.on('overlayremove', handleOverlayRemove);

    L.control.scale().addTo(map);
}

// Load the base maps synchronously
async function loadBaseMaps(date) {
    await define_basemaps(date);
}

// Set up the layer controls after all layers are defined
function setupLayerControls() {
    baseMaps = [{
        groupName: "Base Maps",
        expanded: false,
        layers: {
            "Streets": streets,
            "Planet Imagery": imagery,
            "Topographic": topographic,
            "Terrain": terrain,
            "COG": cog
        }
    }];

    SnowMaps = [{
            groupName: "Snow Maps",
            expanded: true,
            exclusive: true,
            layers: {
                "No Layer": L.tileLayer(''),
                "SNODAS DEPTH": DEPTH,
                "SWANN SWE": SWE,
            }
        },
        {
            groupName: "Overlays",
            expanded: false,
            exclusive: false,
            layers: {
                "SNOTEL": SNOTEL,
                "WB_HU2": WB_HU2,
                "WB_HU4": WB_HU4,
                "WB_HU6": WB_HU6,
                "WB_HU8": WB_HU8,
            }
        }
    ];

    control = L.Control.styledLayerControl(baseMaps, SnowMaps, options).addTo(map);
}

// Update the layers when the date changes
async function updateSnowLayers(date) {
    var active_layers_copy = { ...active_layers };

    map.eachLayer((layer) => {
        map.removeLayer(layer);
    });

    map.removeControl(control);
    map.removeControl(legend_ps);

    await loadBaseMaps(date);

    define_snowmaps(date);
    define_overlays();

    legend_ps = legends2(map, planet_url);

    for (const [key, value] of Object.entries(baseMaps[0].layers)) {
        if (active_layers_copy[value.name]) {
            value.addTo(map);
            if (value.name === 'Imagery') {
                legend_ps.addTo(map);
            }
        }
    }
    for (const [key, value] of Object.entries(SnowMaps[0].layers)) {
        if (active_layers_copy[value.name]) {
            value.addTo(map);
            if (value.name === 'SWE') {
                legend_swe.addTo(map);
            }
            if (value.name === 'DEPTH') {
                legend_depth.addTo(map);
            }
        }
    }
    for (const [key, value] of Object.entries(SnowMaps[1].layers)) {
        if (active_layers_copy[value.name]) {
            value.addTo(map);
        }
    }
    active_layers = active_layers_copy;
    setupLayerControls();
}

// Handle base layer changes
function handleBaseLayerChange(e) {
    for (const [key, value] of Object.entries(baseMaps[0].layers)) {
        active_layers[value.name] = false;
    }

    active_layers[e.layer.name] = true;

    if (e.layer.name === 'Imagery') {
        legend_ps.addTo(map);
    } else {
        map.removeControl(legend_ps);
        legend_ps = legends2(map, planet_url);
    }
}

// Handle overlay additions
function handleOverlayAdd(e) {
    active_layers[e.layer.name] = true;
    if (e.layer.name === 'SWE') {
        legend_swe.addTo(map);
    }
    if (e.layer.name === 'DEPTH') {
        legend_depth.addTo(map);
    }
}

// Handle overlay removals
function handleOverlayRemove(e) {
    active_layers[e.layer.name] = false;
    if (e.layer.name === 'SWE') {
        map.removeControl(legend_swe);
        legend_swe = legends(map, 'SWE');
    }
    if (e.layer.name === 'DEPTH') {
        map.removeControl(legend_depth);
        legend_depth = legends(map, 'DEPTH');
    }
}

// Function to fetch the available dates list
function fetchDatesList() {
    return $.ajax({
        url: 'dates_list.txt',
        dataType: 'text',
        success: function(data) {
            availDates = data.split('\n').filter(Boolean);
        },
        error: function(xhr, status, error) {
            console.error('Error loading file:', error);
        }
    });
}

// Initialize date picker and fetch dates
$(function() {
    fetchDatesList().then(() => {
        $("#datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            beforeShowDay: unavailable,
            onSelect: function(dateText) {
                updateSnowLayers(dateText);
            }
        });
    });
});

// Function to determine unavailable dates
function unavailable(date) {
    if (active_layers['DEPTHs']) {
        var dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        return $.inArray(dmy, availDates) != -1 ? [true, ""] : [false, "", "Unavailable"];
    } else {
        var dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        if (date.getFullYear() <= 2023 && date.getMonth() < 9 || (date.getFullYear() >= currentYear && (date.getMonth() + 1) >= currentMonth && date.getDate() > 1)) {
            return [false, "", "Unavailable"];
        } else {
            return [true, ""];
        }
    }
}

// Initialize the map on page load
$(document).ready(function() {
    initializeMap("2024-04-01");
});
