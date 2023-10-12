const testCasesLimit = 10;
const charX = 'X'
const charO = 'O'
const charDot = '.'

document.addEventListener('DOMContentLoaded', function () {
    function buildTestCasesInputs() {
        let testCases = parseInt(document.querySelector("#testCases").value);

        if (!testCases) {
            showErrorModal("Please type a number of test cases.");
            return;
        }

        if (testCases > testCasesLimit) {
            showErrorModal("Maximum 10 cases are allowed.");
            document.querySelector("#testCases").value = testCasesLimit;
            testCases = testCasesLimit;
        }

        const testCasesContainer = document.querySelector("#testCasesContainer");
        const testCaseValidation = document.querySelector("#testCaseValidation");
        testCasesContainer.innerHTML = "";
        testCaseValidation.innerHTML = "";

        for (let i = 0; i < testCases; i++) {
            const testCaseDiv = document.createElement("div");
            const validationTestCaseDiv = document.createElement("div");

            testCaseDiv.innerHTML = `
                <div class="col-2 text-center">
                    <p class="mt-3">Test Case ${i + 1}</p>
                    <textarea class="form-control test-cases-box" id="grid${i + 1}" name="grid${i + 1}" rows="3" cols="3"
                            placeholder="Enter Tic Tac Toe Grid..." required oninput="checkGridFormat(this)"></textarea>
                    <div class="text-center mt-2">
                        <span id="result${i + 1}" class="fw-bold"></span>
                    </div>
                    <div class="text-center mt-2">
                        <span id="validationMessage${i + 1}" class="text-danger fw-bold"></span>
                    </div>
                </div>
            `;

            testCasesContainer.appendChild(testCaseDiv);
            testCaseValidation.appendChild(validationTestCaseDiv);
        }

        document.querySelector("#validateButton").disabled = false;
        document.querySelector("#randomGridsButton").disabled = false;
    }

    /**
     * Generates a random configuration for a 3x3 Tic Tac Toe grid.
     *
     * @returns {string} - The randomly generated grid.
     */
    function generateRandomTestCase() {
        const characters = [charX, charO, charDot];
        return Array.from({ length: 3 }, () =>
            Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join('')
        ).join('\n');
    }
    /**
     * Generating random Tic Tac Toe grid configurations and populating the corresponding textarea elements in the HTML form.
     */
    function fillTestCasesWithRandomGrids() {
        const testCases = parseInt(document.querySelector("#testCases").value);
        for (let i = 0; i < testCases; i++) {
            document.querySelector(`#grid${i + 1}`).value = generateRandomTestCase();
        }
    }

    /**
     * Process a raw input string representing a Tic Tac Toe grid and convert it into a two-dimensional array (matrix) for further validation.
     *
     * @param {string} inputString -  A string containing the raw input of a Tic Tac Toe grid.
     * @returns {Array<Array<string>>} - A two-dimensional array representing the Tic Tac Toe grid. Each inner array
     *                                  corresponds to a row, and elements represent individual characters (X, O, or '.').
     */
    function parseInputString(inputString) {
        const lines = inputString.trim().split('\n');
        return lines.map(line => line.trim().split(''));
    }

    /**
     * Validates multiple Tic Tac Toe grids and sends a request to the backend for validation.
     */
    function validateGrids() {
        const testCases = parseInt(document.querySelector("#testCases").value);
        const grids = [];
        let isValid = true;

        for (let i = 0; i < testCases; i++) {
            const gridMatrix = parseInputString(document.querySelector(`#grid${i + 1}`).value);
            if (!checkGridIsFilled(gridMatrix, i)) {
                isValid = false;
            }
            grids.push(gridMatrix);
        }

        if (isValid) {
            const route = 'validate'; // Specify the route name
            fetch("backend.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: JSON.stringify({
                    route: route,
                    grids: grids,
                }),

            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        displayValidationResults(data.data);
                    } else {
                        showErrorModal(data.error_message);
                    }
                })
                .catch(error => showErrorModal(error.error_message));
        }
    }

    /**
     * Displays validation results in corresponding spans based on the provided array.
     *
     * @param {string[]} results - An array of validation results ('Yes' or 'No').
     */
    function displayValidationResults(results) {
        for (let i = 0; i < results.length; i++) {
            const resultSpan = document.querySelector(`#result${i + 1}`);
            resultSpan.classList.remove('text-success', 'text-danger');
            resultSpan.textContent = results[i];
            resultSpan.classList.add(results[i] === 'Yes' ? 'text-success' : 'text-danger');
        }
    }

    /**
     * Validates if the Tic Tac Toe grid in the matrix is filled with the correct number of characters.
     *
     * @param {string[][]} matrix - The matrix representing the Tic Tac Toe grid.
     * @param {number} index - The index used to identify the corresponding validation message element.
     * @returns {boolean} - Returns true if the grid is filled correctly; otherwise, false.
     */
    function checkGridIsFilled(matrix, index) {
        const characters = matrix.flat().filter(char => char !== null).length;
        const validationMessage = document.querySelector(`#validationMessage${index + 1}`);
        if (characters !== 9) {
            validationMessage.textContent = `Please type ${9 - characters} more characters`;
            return false;
        } else {
            validationMessage.textContent = "";
            return true;
        }
    }

    document.querySelector('#buildTestCasesButton').addEventListener('click', buildTestCasesInputs);
    document.querySelector('#validateButton').addEventListener('click', validateGrids);
    document.querySelector('#randomGridsButton').addEventListener('click', fillTestCasesWithRandomGrids);
});

/**
 * Validates the format of a Tic Tac Toe grid in a textarea.
 *
 * @param {HTMLTextAreaElement} textarea - The textarea element to be validated.
 */
function checkGridFormat(textarea) {
    const input = textarea.value.slice(-1).toUpperCase();
    const validCharacters = [charX, charO, '\n', charDot];
    if (!validCharacters.includes(input)) {
        showErrorModal(`Invalid character. Please enter only ${charX}, ${charO}, or ${charDot}.`);
        textarea.value = textarea.value.slice(0, -1);
        return;
    }

    const lines = textarea.value.split("\n");
    if (lines.length > 3) {
        showErrorModal("Maximum of 3 lines.");
        textarea.value = textarea.value.slice(0, -1);
        return;
    }

    for (const line of lines) {
        if (line.length > 3) {
            showErrorModal("3 characters in each line.");
            textarea.value = textarea.value.slice(0, -1);
            return;
        }
    }

    textarea.value = textarea.value.toUpperCase();
}

/**
 * Displays an error modal with a specified message.
 *
 * @param {string} message - The error message to be displayed.
 */
function showErrorModal(message) {
    const errorMessageElement = document.querySelector("#errorMessage");
    errorMessageElement.textContent = message;

    const modalElement = document.querySelector("#errorModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    modalElement.addEventListener('hidden.bs.modal', function () {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
        }
    });
}