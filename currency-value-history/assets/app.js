document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "NBg1sA8F6dIFyJg_vToPbN4lq4ZWeZiR";
    let chart = null;

    document.getElementById("showResults").addEventListener("click", () => {
        const base    = document.getElementById("baseCurrency").value.trim().toUpperCase();
        const convert = document.getElementById("convertCurrency").value.trim().toUpperCase();
        const from    = document.getElementById("fromDate").value;
        const to      = document.getElementById("toDate").value;

        ["baseError", "convertError", "fromError", "toError"].forEach(id => {
            document.getElementById(id).textContent = "";
        });

        if (!base)         { document.getElementById("baseError").textContent    = "Base Currency is required.";       return; }
        if (!convert)      { document.getElementById("convertError").textContent = "Convert To Currency is required."; return; }
        if (!from)         { document.getElementById("fromError").textContent    = "From Date is required.";           return; }
        if (!to)           { document.getElementById("toError").textContent      = "To Date is required.";             return; }
        if (from > to)     { document.getElementById("toError").textContent      = "To Date must be after From Date."; return; }

        const url = `https://api.massive.com/v2/aggs/ticker/C:${base}${convert}/range/1/day/${from}/${to}?sort=asc&limit=500&apiKey=${API_KEY}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (!data.results?.length) return alert("No data returned. Check your currency codes and date range.");

                if (chart) chart.destroy();

                chart = new Chart(document.getElementById("chart"), {
                    type: "line",
                    data: {
                        datasets: [{
                            label: `${base} / ${convert}`,
                            data: data.results.map(bar => ({ x: bar.t, y: bar.c })),
                            borderColor: "#2563eb",
                            backgroundColor: "rgba(37, 99, 235, 0.08)",
                            borderWidth: 2,
                            pointRadius: 3,
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        scales: {
                            x: { type: "time", time: { unit: "day" }, title: { display: true, text: "Date" } },
                            y: { title: { display: true, text: `Rate (${base} → ${convert})` } }
                        }
                    }
                });
            })
            .catch(() => alert("Failed to retrieve data. Check your currency codes and date range."));
    });

    document.getElementById("clearForm").addEventListener("click", () => {
        ["baseCurrency", "convertCurrency", "fromDate", "toDate"].forEach(id => {
            document.getElementById(id).value = "";
        });
        ["baseError", "convertError", "fromError", "toError"].forEach(id => {
            document.getElementById(id).textContent = "";
        });
        if (chart) { chart.destroy(); chart = null; }
    });
});