// --- River Site Names ---
const riverNames = {
    "USGS-07055646": "Buffalo River – Ponca",
    "USGS-07055660": "Buffalo River – Boxley",
    "USGS-07055680": "Buffalo River – Pruitt",
    "USGS-07055780": "Buffalo River – Carver"
};


// --- API URL ---
const apiUrl =
    "https://api.waterdata.usgs.gov/ogcapi/v0/collections/latest-continuous/items" +
    "?f=json&lang=en-US&limit=10000" +
    "&properties=monitoring_location_id,parameter_code,statistic_id,time,value,unit_of_measure" +
    "&skipGeometry=true" +
    "&monitoring_location_id=USGS-07055646,USGS-07055660,USGS-07055680,USGS-07055780" +
    "&parameter_code=00065" +
    "&time=P7D";

// --- Main Loader ---
function loadRiverData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("riverData");
            container.innerHTML = "";

            // Sort readings by site order
            const sorted = data.features.sort((a, b) => {
                const idA = a.properties.monitoring_location_id;
                const idB = b.properties.monitoring_location_id;
                return Object.keys(riverNames).indexOf(idA) -
                       Object.keys(riverNames).indexOf(idB);
            });

            sorted.forEach(feature => {
                const props = feature.properties;

                const div = document.createElement("div");
                div.className = "reading";

                // Format date only
                const dateOnly = new Date(props.time).toLocaleDateString();

                div.innerHTML = `
                    <h3>${riverNames[props.monitoring_location_id] || props.monitoring_location_id}</h3>
                    <strong>Date:</strong> ${dateOnly}<br>
                    <strong>Gage Height:</strong>
                    ${
                        props.value !== null
                            ? props.value + " " + props.unit_of_measure
                            : "<span class='null'>No Data</span>"
                    }
                `;

                container.appendChild(div);
            });
        })
        .catch(err => {
            console.error("Error fetching river data:", err);
            document.getElementById("riverData").textContent =
                "Error loading data.";
        });
}

loadRiverData();
