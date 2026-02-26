document.addEventListener("DOMContentLoaded", () => {

    const baseCurrency = document.getElementById("baseCurrency");
    const convertCurrency = document.getElementById("convertCurrency");
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");

    const baseError = document.getElementById("baseError");
    const convertError = document.getElementById("convertError");
    const fromError = document.getElementById("fromError");
    const toError = document.getElementById("toError");

    const showBtn = document.getElementById("showResults");
    const clearBtn = document.getElementById("clearForm");

    let chart;

    showBtn.addEventListener("click", () => {
        clearErrors();

        const base = baseCurrency.value;
        const convert = convertCurrency.value;
        const from = fromDate.value;   
        const to = toDate.value;       

        let valid = true;

        if (!base) { baseError.textContent = "Base Currency is Required"; valid = false; }
        if (!convert) { convertError.textContent = "Convert To Currency is Required"; valid = false; }
        if (!from) { fromError.textContent = "From Date is Required"; valid = false; }
        if (!to) { toError.textContent = "To Date is Required"; valid = false; }

        if (!valid) return;

        const url = `https://api.frankfurter.app/${from}..${to}?from=${base}&to=${convert}`;

        fetch(url)
            .then(r => r.json())
            .then(data => {
                if (!data || !data.rates) {
                    alert("No data returned for this currency pair.");
                    return;
                }

                let points = Object.keys(data.rates).map(date => ({
                    x: date,
                    y: data.rates[date][convert]
                }));

                points.sort((a, b) => new Date(a.x) - new Date(b.x));

                drawChart(points, base, convert);
            })
            .catch(() => alert("Error retrieving data."));
    });

    clearBtn.addEventListener("click", () => {
        baseCurrency.value = "";
        convertCurrency.value = "";
        fromDate.value = "";
        toDate.value = "";

        clearErrors();

        if (chart) {
            chart.destroy();
            chart = null;
        }
    });

    function clearErrors() {
        baseError.textContent = "";
        convertError.textContent = "";
        fromError.textContent = "";
        toError.textContent = "";
    }

    function drawChart(points, base, convert) {
        const ctx = document.getElementById("chart");

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "line",
            data: {
                datasets: [{
                    label: `${base} to ${convert}`,
                    data: points,
                    borderColor: "blue",
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: {
                scales: {
                    x: {
                        type: "time", 
                        time: { 
                            unit: "day" 
                        }
                    }
                }
            }
        });
    }
});