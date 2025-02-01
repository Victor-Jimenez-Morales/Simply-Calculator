// Calculator display input
let display = document.getElementById("display");
let operationCalculated = false;

function appendToDisplay(param) {
    if (operationCalculated) {
        display.value = "";
        operationCalculated = false;
    }

    // Handle operators and colons
    let lastInput = display.value.slice(-1);
    if ((["x", "/", "+", "-"].includes(param) && ["x", "/", "+", "-"].includes(lastInput)) || (lastInput == "." && param == ".")) {
        deleteLast();
    }

    display.value += param;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function convertPercentage() {
    const regex = /[+\-x/]/;
    const lastNumber = display.value.split(regex).pop();
    if (lastNumber != "") {
        display.value += "/100";
    }
}

function calculateResult() {
    function processOperators(array, operators) {
        const result = [];
        let i = 0;

        while (i < array.length) {
            if (operators.includes(array[i])) {
                const leftNum = parseFloat(result.pop()); // Previous number
                const rightNum = parseFloat(array[i + 1]); // Next number

                // Perform the operation
                let calc;
                switch (array[i]) {
                    case "*":
                        calc = leftNum * rightNum;
                        break;
                    case "/":
                        calc = leftNum / rightNum;
                        break;
                    case "+":
                        calc = leftNum + rightNum;
                        break;
                    case "-":
                        calc = leftNum - rightNum;
                        break;
                }

                result.push(calc);
                i += 2; // Skip the operator and the next number
            } else {
                result.push(array[i]);
                i++;
            }
        }

        return result;
    }

    const operation = display.value;
    const regex = /([+\-x/])/;
    const input = operation.split(regex).map((item) => (item === "x" ? "*" : item));

    if (input[0] === "" && input.length === 1) {
        display.value = 0;
    } else {
        // Handle '*' and '/' first
        let result = processOperators(input, ["*", "/"]);

        // Handle '+' and '-' next
        result = processOperators(result, ["+", "-"]);

        display.value = isNaN(result) ? "Err" : result;

        addToHistory(operation, result);
    }

    operationCalculated = true;
}

function getHistory() {
    const history = document.querySelector("#history-list");
    let operationHistory = JSON.parse(localStorage.getItem("operationHistory"));

    history.innerHTML = "";
    if (operationHistory == null) operationHistory = [];

    if (operationHistory.length == 0) {
        const element = document.createElement("p");

        element.textContent = "There isn't any operations yet!";

        history.append(element);

        operationHistory = [];
        localStorage.setItem("operationHistory", JSON.stringify(operationHistory));
    } else {
        for (const value of operationHistory.reverse()) {
            const element = document.createElement("p");

            element.classList.add("history-line");
            element.textContent = value;
            history.prepend(element);
        }
    }
}

function addToHistory(operation, result) {
    let operationHistory = JSON.parse(localStorage.getItem("operationHistory"));

    operationHistory.unshift(`${operation} = ${result}`);
    localStorage.setItem("operationHistory", JSON.stringify(operationHistory));

    getHistory();
}

function clearHistory() {
    localStorage.clear();
    getHistory();
}

addEventListener("keydown", function (event) {
    if (event.key === "Backspace") {
        deleteLast();
    }
});

getHistory();
