// Get elements from the HTML
const display = document.getElementById("display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

// Calculator state
let currentInput = "0";
let firstNumber = null;
let currentOperator = null;
let waitingForSecondNumber = false;
let justCalculated = false;

// Update calculator display
function updateDisplay() {
    display.textContent = currentInput;

    if (currentInput === "Error: Cannot divide by zero") {
        display.classList.add("error");
    } else {
        display.classList.remove("error");
    }
}

// Format numbers to avoid unnecessary floating-point digits
function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    const roundedNumber = Math.round((number + Number.EPSILON) * 100000000) / 100000000;

    return String(roundedNumber);
}

// Perform arithmetic operation
function calculate(first, operator, second) {

    switch (operator) {
        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":
            if (second === 0) {
                return null;
            }
            return first / second;

        default:
            return second;
    }
}

// Handle number button
function inputNumber(number) {

    // Start fresh after displaying a result
    if (justCalculated) {
        currentInput = number;
        justCalculated = false;
        previousDisplay.textContent = "";
        updateDisplay();
        return;
    }

    // Replace 0 with entered number
    if (currentInput === "0") {
        currentInput = number;
    } else if (waitingForSecondNumber) {
        currentInput = number;
        waitingForSecondNumber = false;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

// Handle decimal button
function inputDecimal() {

    if (justCalculated) {
        currentInput = "0.";
        justCalculated = false;
        previousDisplay.textContent = "";
        updateDisplay();
        return;
    }

    if (waitingForSecondNumber) {
        currentInput = "0.";
        waitingForSecondNumber = false;
        updateDisplay();
        return;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
        updateDisplay();
    }
}

// Handle operator
function chooseOperator(operator) {

    if (currentInput === "Error: Cannot divide by zero") {
        return;
    }

    const inputNumberValue = parseFloat(currentInput);

    if (firstNumber === null) {
        firstNumber = inputNumberValue;
    } else if (currentOperator !== null && !waitingForSecondNumber) {

        const result = calculate(
            firstNumber,
            currentOperator,
            inputNumberValue
        );

        // Division-by-zero error
        if (result === null) {
            currentInput = "Error: Cannot divide by zero";
            previousDisplay.textContent = `${firstNumber} ÷ 0`;
            firstNumber = null;
            currentOperator = null;
            waitingForSecondNumber = false;
            justCalculated = true;
            updateDisplay();
            return;
        }

        firstNumber = result;
        currentInput = formatNumber(result);
    }

    currentOperator = operator;
    waitingForSecondNumber = true;
    justCalculated = false;

    previousDisplay.textContent =
        `${formatNumber(firstNumber)} ${getDisplayOperator(operator)}`;

    updateDisplay();
}

// Handle equals button
function calculateResult() {

    if (
        firstNumber === null ||
        currentOperator === null ||
        waitingForSecondNumber
    ) {
        return;
    }

    const secondNumber = parseFloat(currentInput);

    const result = calculate(
        firstNumber,
        currentOperator,
        secondNumber
    );

    // Division-by-zero error
    if (result === null) {
        previousDisplay.textContent =
            `${formatNumber(firstNumber)} ÷ ${formatNumber(secondNumber)}`;

        currentInput = "Error: Cannot divide by zero";
        firstNumber = null;
        currentOperator = null;
        waitingForSecondNumber = false;
        justCalculated = true;

        updateDisplay();
        return;
    }

    previousDisplay.textContent =
        `${formatNumber(firstNumber)} ${getDisplayOperator(currentOperator)} ${formatNumber(secondNumber)} =`;

    currentInput = formatNumber(result);

    firstNumber = null;
    currentOperator = null;
    waitingForSecondNumber = false;
    justCalculated = true;

    updateDisplay();
}

// Clear calculator
function clearCalculator() {

    currentInput = "0";
    firstNumber = null;
    currentOperator = null;
    waitingForSecondNumber = false;
    justCalculated = false;

    previousDisplay.textContent = "";

    updateDisplay();
}

// Backspace
function deleteLastCharacter() {

    if (justCalculated || currentInput === "Error: Cannot divide by zero") {
        clearCalculator();
        return;
    }

    if (waitingForSecondNumber) {
        return;
    }

    if (currentInput.length <= 1) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

// Convert symbols for display
function getDisplayOperator(operator) {

    switch (operator) {

        case "+":
            return "+";

        case "-":
            return "−";

        case "*":
            return "×";

        case "/":
            return "÷";

        default:
            return operator;
    }
}

// Add event listeners to number buttons
numberButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;

        if (number !== undefined) {
            inputNumber(number);
        }

    });

});

// Add event listeners to operator buttons
operatorButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const operator = button.dataset.operator;

        if (operator !== undefined) {
            chooseOperator(operator);
        }

    });

});

// Add event listeners to other buttons
actionButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        switch (action) {

            case "clear":
                clearCalculator();
                break;

            case "backspace":
                deleteLastCharacter();
                break;

            case "decimal":
                inputDecimal();
                break;

            case "equals":
                calculateResult();
                break;

            default:
                break;
        }

    });

});

// Keyboard support
document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (key >= "0" && key <= "9") {
        inputNumber(key);
        return;
    }

    if (key === ".") {
        inputDecimal();
        return;
    }

    if (key === "+" || key === "-" || key === "*" || key === "/") {
        chooseOperator(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        calculateResult();
        return;
    }

    if (key === "Backspace") {
        deleteLastCharacter();
        return;
    }

    if (key === "Escape" || key.toLowerCase() === "c") {
        clearCalculator();
    }

});

// Initial display
updateDisplay();