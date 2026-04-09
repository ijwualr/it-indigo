// --- River Site Names ---
const riverNames = { "USGS-07055646": "Buffalo River – Ponca", "USGS-07055660": "Buffalo River – Boxley", "USGS-07055680": "Buffalo River – Pruitt", "USGS-07055875": "Buffalo River – St. Joe" };

// --- River Site Coordinates (for OpenWeatherMap) ---
const riverCoords = { "USGS-07055646": { lat: 36.0407, lon: -93.1549 }, "USGS-07055660": { lat: 35.9837, lon: -93.3354 }, "USGS-07055680": { lat: 36.0493, lon: -93.1541 }, "USGS-07055875": { lat: 36.0337, lon: -92.7574 } };

// --- API URL (7 days, multiple sites) ---
const apiUrl = "https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items" +
    "?f=json&lang=en-US&limit=10000" +
    "&properties=monitoring_location_id,parameter_code,statistic_id,time,value,unit_of_measure" +
    "&skipGeometry=true" +
    "&monitoring_location_id=USGS-07055646,USGS-07055660,USGS-07055680,USGS-07055875" +
    "&parameter_code=00065" +
    "&time=P7D";

// cache of all features so we don't refetch for graphs
let allFeatures = [];
let riverChart = null;

// --- Weather per site (OpenWeatherMap) ---
function loadWeatherForSite(siteId, containerDiv) {
    const apiKey = "9fa61f0e3c6df65b84068e0ae2911dff";
    const coords = riverCoords[siteId];
    if (!coords) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${apiKey}`;

    fetch(url).then(res => res.json()).then(data => {
        if (!data || !data.main || !data.weather) return;

        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].description;
        const icon = data.weather[0].icon;

        const weatherDiv = document.createElement("div");
        weatherDiv.className = "weather-inline";
        weatherDiv.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt=""><span><strong>${temp}°F</strong> – ${desc}</span>`;
        containerDiv.appendChild(weatherDiv);
    }).catch(err => console.error("Weather error:", err));
}

// --- Main Loader ---
function loadRiverData() {
    fetch(apiUrl).then(response => response.json()).then(data => {
        allFeatures = data.features || [];
        const container = document.getElementById("riverData");
        container.innerHTML = "";

        const siteOrder = Object.keys(riverNames);
        const latestBySite = {};

        allFeatures.forEach(feature => {
            const props = feature.properties;
            const id = props.monitoring_location_id;
            if (!latestBySite[id]) latestBySite[id] = feature;
            else {
                const prevTime = new Date(latestBySite[id].properties.time);
                const currTime = new Date(props.time);
                if (currTime > prevTime) latestBySite[id] = feature;
            }
        });

        const sortedSites = siteOrder.filter(id => latestBySite[id]);

        sortedSites.forEach(siteId => {
            const feature = latestBySite[siteId];
            const props = feature.properties;

            const div = document.createElement("div");
            div.className = "reading";

            const dateOnly = new Date(props.time).toLocaleDateString();

            div.innerHTML = `<h3>${riverNames[siteId] || siteId}</h3><strong>Date:</strong> ${dateOnly}<br><strong>Gage Height:</strong>${props.value !== null ? props.value + " " + props.unit_of_measure : "<span class='null'>No Data</span>"}<br>`;

            loadWeatherForSite(siteId, div);

            const btn = document.createElement("button");
            btn.textContent = "Show 7‑Day Graph";
            btn.className = "show-graph";
            btn.addEventListener("click", () => showGraph(siteId));

            div.appendChild(btn);
            container.appendChild(div);
        });

        if (sortedSites.length === 0) container.textContent = "No data available for the selected sites.";
    }).catch(err => {
        console.error("Error fetching river data:", err);
        document.getElementById("riverData").textContent = "Error loading data.";
    });
}

// --- Graph Renderer ---
function showGraph(siteId) {
    const siteName = riverNames[siteId] || siteId;

    const siteReadings = allFeatures.filter(f => f.properties.monitoring_location_id === siteId && f.properties.value !== null).map(f => ({ time: new Date(f.properties.time), value: Number(f.properties.value) })).sort((a, b) => a.time - b.time);

    if (siteReadings.length === 0) {
        document.getElementById("graphTitle").textContent = siteName + " – No graphable data for the last 7 days.";
        if (riverChart) { riverChart.destroy(); riverChart = null; }
        return;
    }

    const labels = siteReadings.map(r => r.time.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    const values = siteReadings.map(r => r.value);

    document.getElementById("graphTitle").textContent = siteName + " – Gage Height (Last 7 Days)";
    const ctx = document.getElementById("riverChart").getContext("2d");

    if (riverChart) riverChart.destroy();

    riverChart = new Chart(ctx, {
        type: "line",
        data: { labels: labels, datasets: [{ label: "Gage Height (ft)", data: values, borderColor: "#1f6feb", backgroundColor: "rgba(31, 111, 235, 0.18)", borderWidth: 2, pointRadius: 0, pointHitRadius: 10, tension: 0.25 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { ticks: { maxRotation: 45, autoSkip: true, maxTicksLimit: 14 } }, y: { beginAtZero: false } },
            plugins: { legend: { display: true }, tooltip: { mode: "index", intersect: false } }
        }
    });
}

loadRiverData();
