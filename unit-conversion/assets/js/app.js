document.addEventListener("DOMContentLoaded", function () {
    const calcBtn = document.querySelector("input[value='Calculate']");
    const clearBtn = document.querySelector("input[value='Clear']");

    calcBtn.addEventListener("click", calculate);
    clearBtn.addEventListener("click", clearform);
});

function calculate() {
    clearErrors();

    const fromValue = document.getElementById("FromValue").value.trim();
    const fromUnit = document.querySelector("input[name='FromUnit']:checked");
    const toUnit = document.querySelector("input[name='ToUnit']:checked");

    let valid = true;

    // --- Validation ---
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

    // --- AJAX call to PHP conversion service ---
    $.ajax({
        url: "https://brucebauer.info/assets/ITEC3650/unitsconversion.php",
        type: "GET",
        dataType: "json",
        data: {
            FromValue: fromValue,
            FromUnit: fromUnit.value,
            ToUnit: toUnit.value
        },
        beforeSend: function () {
            // Optional: show temporary loading indicator
            document.getElementById("ToValue").value = "Calculating...";
        },
        success: function (response) {
            // PHP returns numeric result
            document.getElementById("ToValue").value = parseFloat(response).toFixed(6);
        },
        error: function (xhr, status, error) {
            alert("Error performing conversion: " + error);
            document.getElementById("ToValue").value = "";
        }
    });
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
