document.addEventListener("DOMContentLoaded", function () {
    const calcBtn = document.querySelector("input[value='Calculate']");
    const clearBtn = document.querySelector("input[value='Clear']");

    calcBtn.addEventListener("click", calculate);
    clearBtn.addEventListener("click", clearform);
});

function calculate() {
    clearErrors();

    let fromValue = document.getElementById("FromValue").value.trim();
    let fromUnit = document.querySelector("input[name='FromUnit']:checked");
    let toUnit = document.querySelector("input[name='ToUnit']:checked");

    let valid = true;

    if (fromValue === "") {
        showError("FromValueMsg", "Value is required");
        valid = false;
    } else if (isNaN(parseFloat(fromValue))) {
        showError("FromValueMsg", "Value must be a number");
        valid = false;
    }

    if (!fromUnit) {
        showError("FromUnitMsg", "From unit is required");
        valid = false;
    }

    if (!toUnit) {
        showError("ToUnitMsg", "To unit is required");
        valid = false;
    }

    if (!valid) return;

    const conversionToMeters = {
        cm: 0.01,
        m: 1,
        km: 1000,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.34
    };

    let value = parseFloat(fromValue);
    let from = fromUnit.value;
    let to = toUnit.value;

    let meters = value * conversionToMeters[from];
    let result = meters / conversionToMeters[to];

    document.getElementById("ToValue").value = result.toFixed(6);
}

function clearform() {
    document.getElementById("FromValue").value = "";
    document.getElementById("ToValue").value = "";

    document.querySelectorAll("input[name='FromUnit']").forEach(r => r.checked = false);
    document.querySelectorAll("input[name='ToUnit']").forEach(r => r.checked = false);

    clearErrors();
}

function clearErrors() {
    hideError("FromValueMsg");
    hideError("FromUnitMsg");
    hideError("ToUnitMsg");
}

function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = "inline"; 
}

function hideError(id) {
    const el = document.getElementById(id);
    el.textContent = "";
    el.style.display = "none";
}
