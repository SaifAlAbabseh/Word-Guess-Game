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
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://random-word-api.herokuapp.com/word?length=" + wordLength + "&lang=" + language, false);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            let json = JSON.parse(this.responseText);
            word = json[0].toUpperCase();
        }
    };
    xmlhttp.send();
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

function initGameBox() {
    let gameBox = document.getElementById("game-box");
    for (let row = 1; row <= numberOfTries; row++) {
        let inputFieldsRow = document.createElement("div");
        inputFieldsRow.classList.add("flex-box");
        inputFieldsRow.classList.add("input-fields-row");
        let tryNumberLabel = document.createElement("h2");
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
            if (row > 1) inputField.classList.add("input-field-disabled");
            else inputField.classList.add("input-field-enabled");
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
            inputField.classList.remove("input-field-enabled");
            inputField.classList.add("input-field-disabled");
            if (inputField.value === "") inputField.style.backgroundColor = "black"
            else {
                if (word.includes(inputField.value) && ("" + word.charAt(index - 1)) === inputField.value) inputField.style.backgroundColor = "green";
                else if (word.includes(inputField.value) && ("" + word.charAt(index - 1)) !== inputField.value) {
                    inputField.style.backgroundColor = "orange";
                }
                else inputField.style.backgroundColor = "black";
            }
        }
        currentTryNumber++;
        if (word === userInput) {
            isWin = true;
            let wordBox = document.getElementById("word-box");
            wordBox.innerHTML = "You Won :) the word is: " + word;
            submitButton.style.pointerEvents = "none";
            submitButton.style.backgroundColor = "gray";
            hintButton.style.pointerEvents = "none";
            hintButton.style.backgroundColor = "gray";
        }
        else {
            if (currentTryNumber != numberOfTries + 1) {
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
    if(currentTryNumber == 6 && !isWin) {
        for (let index = 1; index <= wordLength; index++) {
            let inputField = document.getElementById((currentTryNumber - 1) + "-" + index);
            inputField.classList.remove("input-field-enabled");
            inputField.classList.add("input-field-disabled");
            if (inputField.value === "") inputField.style.backgroundColor = "black"
            else {
                if (word.includes(inputField.value) && ("" + word.charAt(index - 1)) === inputField.value) inputField.style.backgroundColor = "green";
                else if (word.includes(inputField.value) && ("" + word.charAt(index - 1)) !== inputField.value) inputField.style.backgroundColor = "orange";
                else inputField.style.backgroundColor = "black";
            }
        }
        submitButton.style.pointerEvents = "none";
        submitButton.style.backgroundColor = "gray";
        hintButton.style.pointerEvents = "none";
        hintButton.style.backgroundColor = "gray";
        let wordBox = document.getElementById("word-box");
        wordBox.innerHTML = "You Lost :( the correct word was: " + word;
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
}

// Listeners

window.addEventListener("load", loadPage);
restartButton.addEventListener("click", restartGame);
submitButton.addEventListener("click", submitGuess);
hintButton.addEventListener("click", putHint);