// Global Variables

let language = "en";
let word = "";
let wordLength = 6;
let numberOfTries = 5;
let numberOfHints = 3;
let currentTryNumber = 1;
let isWin = false;

let restartButton = document.getElementById("restart-button");
let submitButton = document.getElementById("submit-button");
let hintButton = document.getElementById("hint-button");
let hintLabel = document.getElementById("number-of-hints");
let wordBox = document.getElementById("word-box");

// Functions

function loadPage() {
    // First we need to get the word to guess
    getWord();
    // Now we need to load the input fields for the game box(numberOfTries x wordLength)
    initGameBox();
    // Load how much hints we haves
    loadHints();
}

function getWord() {
    fetch("https://random-word-api.herokuapp.com/word?length=" + wordLength + "&lang=" + language)
    .then(response => {
        response.text()
        .then( data => {
            let jsonData = JSON.parse(data);
            word = jsonData[0].toUpperCase();
        })
    })
}

function moveLeft(colNum, rowNum) {
    if (colNum > 1) {
        for (let index = colNum - 1; index >= 1; index--) {
            if (!document.getElementById(rowNum + "-" + index).classList.contains("input-field-disabled")) {
                let newId = rowNum + "-" + index;
                document.getElementById(newId).focus();
                break;
            }
        }
    }
}

function moveRight(colNum, rowNum) {
    if (colNum < wordLength) {
        for (let index = colNum + 1; index <= wordLength; index++) {
            if (!document.getElementById(rowNum + "-" + index).classList.contains("input-field-disabled")) {
                let newId = rowNum + "-" + index;
                document.getElementById(newId).focus();
                break;
            }
        }
    }
}

function endGame(endMessage) {
    submitButton.style.pointerEvents = "none";
    submitButton.style.backgroundColor = "gray";
    hintButton.style.pointerEvents = "none";
    hintButton.style.backgroundColor = "gray";
    wordBox.innerHTML = endMessage + word;
}

function checkLetter(isEnd, index) {
    let inputField = document.getElementById((currentTryNumber - isEnd) + "-" + index);
    inputField.classList.remove("input-field-enabled");
    inputField.classList.add("input-field-disabled");
    if (inputField.value === "") inputField.style.backgroundColor = "black"
    else {
        if (word.includes(inputField.value) && ("" + word.charAt(index - 1)) === inputField.value) inputField.style.backgroundColor = "green";
        else if (word.includes(inputField.value) && ("" + word.charAt(index - 1)) !== inputField.value) inputField.style.backgroundColor = "orange";
        else inputField.style.backgroundColor = "black";
    }
}

function initGameBox() {
    let gameBox = document.getElementById("game-box");
    for (let row = 1; row <= numberOfTries; row++) {
        let inputFieldsRow = document.createElement("div");
        inputFieldsRow.classList.add("flex-box");
        inputFieldsRow.classList.add("input-fields-row");
        let tryNumberLabel = document.createElement("h2");
        tryNumberLabel.id = "try-" + row;
        tryNumberLabel.innerHTML = "TRY #" + row;
        tryNumberLabel.classList.add("try-number-label");
        inputFieldsRow.appendChild(tryNumberLabel);
        for (let col = 1; col <= wordLength; col++) {
            let inputField = document.createElement("input");
            inputField.type = "text";
            inputField.id = row + "-" + col;
            inputField.classList.add("input-field");
            inputField.autocomplete = "off";
            inputField.addEventListener("keyup", function (event) {

                let indexes = ("" + this.id).split("-");
                let rowNum = Number(indexes[0]);
                let colNum = Number(indexes[1]);

                if (event.key == "Tab" || event.key == "ArrowLeft" || event.key == "ArrowRight" || event.key == "Backspace") {
                    if (event.key == "Tab") if (this.classList.contains("input-field-disabled")) this.blur();
                    if (event.key == "ArrowLeft" || event.key == "Backspace") moveLeft(colNum, rowNum);
                    else if (event.key == "ArrowRight") moveRight(colNum, rowNum);
                }
                else if ((("" + this.value).charCodeAt(0) >= 65 && ("" + this.value).charCodeAt(0) <= 90) || (("" + this.value).charCodeAt(0) >= 97 && ("" + this.value).charCodeAt(0) <= 122)) {
                    if (this.value.length > 1) this.value = ("" + this.value).substring(0, this.value.length - 1);
                    let upperCaseText = ("" + this.value).toUpperCase();
                    this.value = upperCaseText;
                    moveRight(colNum, rowNum);
                }
                else this.value = "";
            });
            if (row > 1) {
                inputField.classList.add("input-field-disabled");
                tryNumberLabel.style.color = "gray";
            }
            else {
                inputField.classList.add("input-field-enabled");
                tryNumberLabel.style.color = "white";
            }
            inputFieldsRow.appendChild(inputField);
        }
        gameBox.appendChild(inputFieldsRow);
    }
}

function restartGame() {
    window.location.reload();
}

function loadHints() {
    hintLabel.innerHTML = numberOfHints;
}

function submitGuess() {
    if (currentTryNumber <= numberOfTries) {
        let userInput = "";
        for (let index = 1; index <= wordLength; index++) {
            let inputField = document.getElementById(currentTryNumber + "-" + index);
            userInput += inputField.value;
            checkLetter(0, index);
        }
        let tryNumberLabel = document.getElementById("try-" + currentTryNumber);
        tryNumberLabel.style.color = "gray";
        currentTryNumber++;
        if (word === userInput) {
            isWin = true;
            endGame("You Won :) the word is: ");
        }
        else {
            if (currentTryNumber != numberOfTries + 1) {
                let tryNumberLabel = document.getElementById("try-" + currentTryNumber);
                tryNumberLabel.style.color = "white";
                for (let index = 1; index <= wordLength; index++) {
                    let prevInputField = document.getElementById((currentTryNumber - 1) + "-" + index);
                    let inputField = document.getElementById(currentTryNumber + "-" + index);
                    inputField.classList.remove("input-field-disabled");
                    inputField.classList.add("input-field-enabled");
                    if (prevInputField.style.backgroundColor === "green") {
                        inputField.classList.remove("input-field-enabled");
                        inputField.classList.add("input-field-disabled");
                        inputField.style.backgroundColor = "green";
                        inputField.value = prevInputField.value;
                    }
                }
            }
        }
    }
    if (currentTryNumber == 6 && !isWin) {
        for (let index = 1; index <= wordLength; index++) checkLetter(1, index);
        endGame("You Lost :( the correct word was: ");
    }
}

function putHint() {
    numberOfHints--;
    hintLabel.innerHTML = numberOfHints;
    if (numberOfHints == 0) {
        hintButton.style.pointerEvents = "none";
        hintButton.style.backgroundColor = "gray";
    }

    let possiblePlaces = "";
    for (let index = 1; index <= wordLength; index++) {
        let inputField = document.getElementById(currentTryNumber + "-" + index);
        if (inputField.style.backgroundColor !== "green") possiblePlaces += index;
    }
    let randomPlace = parseInt(Math.random() * possiblePlaces.length);
    let hintPlace = parseInt(possiblePlaces.charAt(randomPlace));
    let inputField = document.getElementById(currentTryNumber + "-" + hintPlace);
    inputField.classList.remove("input-field-enabled");
    inputField.classList.add("input-field-disabled");
    inputField.style.backgroundColor = "green";
    inputField.value = word.charAt(hintPlace - 1);
    let isAll = true;
    for(let i = 1; i <= wordLength; i++) {
        if (!document.getElementById(currentTryNumber + "-" + i).classList.contains("input-field-disabled")) isAll = false;
    }
    if(isAll) {
        isWin = true;
        endGame("You Won :) the word is: ");
    }
}

// Listeners

window.addEventListener("load", loadPage);
restartButton.addEventListener("click", restartGame);
submitButton.addEventListener("click", submitGuess);
hintButton.addEventListener("click", putHint);