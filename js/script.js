// Calculator display input
let display = document.getElementById("display");

function appendToDisplay(param) {
    let lastInput = display.value.slice(-1);

    // Handle operators and colons
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

addEventListener("keydown", function (event) {
    if (event.key === "Backspace") {
        deleteLast();
    }
});

function convertPercentage() {
    const regex = /[+\-x/]/;
    let lastNumber = display.value.split(regex).pop();
    if (lastNumber != "") {
        display.value += "/100";
    }
}

function calculateResult() {
    const regex = /([+\-x/])/;
    let input = display.value.split(regex).map((item) => (item === "x" ? "*" : item));
    console.log(input);
    if (input[0] === "" && input.length === 1) {
        display.value = 0;
    } else {
        // Handle '*' and '/' first
        let result = processOperators(input, ["*", "/"]);

        // Handle '+' and '-' next
        result = processOperators(result, ["+", "-"]);

        display.value = isNaN(result) ? "Err" : result;
    }

    function processOperators(array, operators) {
        const result = [];
        let i = 0;

        while (i < array.length) {
            if (operators.includes(array[i])) {
                let leftNum = parseFloat(result.pop()); // Previous number
                let rightNum = parseFloat(array[i + 1]); // Next number

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
}
