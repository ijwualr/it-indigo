document.getElementById("calcBtn").addEventListener("click", calculate);
document.getElementById("clearBtn").addEventListener("click", clearAll);

function calculate() {
    clearErrors();

    let op1 = document.getElementById("op1").value.trim();
    let op2 = document.getElementById("op2").value.trim();
    let operator = document.querySelector("input[name='operator']:checked");

    let valid = true;

    // Validate Operand 1
    if (op1 === "") {
        showError("err-op1", "Operand 1 is required");
        valid = false;
    } else if (isNaN(parseFloat(op1))) {
        showError("err-op1", "Operand 1 must be numeric");
        valid = false;
    }

    // Validation
    if (!operator) {
        showError("err-op", "Operator is required");
        valid = false;
    }

    // Validate Operand 2
    if (op2 === "") {
        showError("err-op2", "Operand 2 is required");
        valid = false;
    } else if (isNaN(parseFloat(op2))) {
        showError("err-op2", "Operand 2 must be numeric");
        valid = false;
    }

    if (!valid) return;

    op1 = parseFloat(op1);
    op2 = parseFloat(op2);
    operator = operator.value;

    let result;

    switch (operator) {
        case "+":
            result = op1 + op2;
            break;
        case "-":
            result = op1 - op2;
            break;
        case "*":
            result = op1 * op2;
            break;
        case "/":
            if (op2 === 0) {
                showError("err-op2", "Cannot divide by zero");
                return;
            }
            result = op1 / op2;
            break;
    }

    document.getElementById("result").textContent = result;
}

function clearAll() {
    document.getElementById("op1").value = "";
    document.getElementById("op2").value = "";
    document.getElementById("result").textContent = "";

    let radios = document.querySelectorAll("input[name='operator']");
    radios.forEach(r => r.checked = false);

    clearErrors();
}

function clearErrors() {
    document.getElementById("err-op1").textContent = "";
    document.getElementById("err-op").textContent = "";
    document.getElementById("err-op2").textContent = "";
}

function showError(id, msg) {
    document.getElementById(id).textContent = msg;
}
