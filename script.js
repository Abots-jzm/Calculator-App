"use strict";

const ALL_DIGITS = "1234567890.";
const ALL_OPERATIONS = "x/-+";
const KEYBOARD_BTNS = ["Backspace", "Enter", "*"];

const themeSwitcher = document.querySelector(".switch--background");
const switchHead = document.querySelector(".switch");
const keypad = document.querySelector(".keypad");
const previousDisplayed = document.querySelector(".display--previous");
const currentDisplayed = document.querySelector(".display--active");

let previousOperation;
let storedNumber = 0;
let currentTheme = 1;
let numberToBeDisplayed = "0";
let previousToBeDisplayed = previousDisplayed.textContent;
let backupNumber = 0;
const emptySpace = previousToBeDisplayed;
let previousKey;

//FUNCTIONS
function setTheme(theme) {
	document.documentElement.className = theme;
}

function moveSwitch(theme) {
	if (theme === 1) {
		switchHead.classList.remove("right");
	}
	if (theme === 2) {
		switchHead.classList.add("middle");
	}
	if (theme === 3) {
		switchHead.classList.remove("middle");
		switchHead.classList.add("right");
	}
}

function handleThemeSwitching() {
	currentTheme++;
	if (currentTheme > 3) currentTheme = 1;

	moveSwitch(currentTheme);

	const themeStr = `t${currentTheme}`;
	setTheme(themeStr);

	localStorage.setItem("theme", themeStr);
}

function handleDelete() {
	numberToBeDisplayed = numberToBeDisplayed.slice(0, -1);
}

function handleOperation(operation) {
	if (!previousToBeDisplayed.trim() || !previousOperation) {
		storedNumber = +numberToBeDisplayed || backupNumber;
		previousToBeDisplayed = `${numberToBeDisplayed || backupNumber} ${operation}`;
		numberToBeDisplayed = "";
		previousOperation = operation;
		return;
	}

	let result = getResult();
	if (isNaN(result)) result = 0;
	previousToBeDisplayed = `${result} ${operation}`;
	storedNumber = result;
	numberToBeDisplayed = "";
	previousOperation = operation;
}

function getResult() {
	switch (previousOperation) {
		case "+":
			return storedNumber + +numberToBeDisplayed;
		case "-":
			return storedNumber - +numberToBeDisplayed;
		case "/":
			return storedNumber / +numberToBeDisplayed;
		case "x":
			return storedNumber * +numberToBeDisplayed;
	}
}

function handleEquals() {
	if (!previousOperation) return;

	let result = getResult();
	if (isNaN(result)) result = 0;
	previousToBeDisplayed = `${storedNumber} ${previousOperation} ${numberToBeDisplayed} =`;
	storedNumber = result;
	backupNumber = result;
	numberToBeDisplayed = result + "";
	previousOperation = null;
}

function reset() {
	previousOperation = null;
	storedNumber = 0;
	numberToBeDisplayed = "0";
	previousToBeDisplayed = emptySpace;
	backupNumber = 0;
	previousKey = null;
}

function handleButtonClick(buttonClicked) {
	if (numberToBeDisplayed.replace(".", "").length > 7 && ALL_DIGITS.includes(buttonClicked)) return;

	if (!ALL_DIGITS.includes(buttonClicked)) {
		if (buttonClicked === "DEL") handleDelete();
		if (ALL_OPERATIONS.includes(buttonClicked)) handleOperation(buttonClicked);
		if (buttonClicked === "=") handleEquals();
		if (buttonClicked === "RESET") reset();
		return;
	}

	if (numberToBeDisplayed === "0" && buttonClicked !== ".") {
		numberToBeDisplayed = buttonClicked;
		return;
	}

	if (buttonClicked === "." && numberToBeDisplayed.includes(".")) return;

	if (!numberToBeDisplayed) {
		previousToBeDisplayed = emptySpace;
		storedNumber = 0;
		previousOperation = null;
	}

	numberToBeDisplayed += buttonClicked;
}

function initTheme() {
	const theme = localStorage.getItem("theme");
	if (theme) {
		setTheme(theme);
		currentTheme = +theme[1];
	} else {
		setTheme("t1");
		currentTheme = 1;
	}
	moveSwitch(currentTheme);
}

function handlePreviousFormatting() {
	previousDisplayed.textContent = previousToBeDisplayed;
}

function handleDisplayFormatting(addition = "") {
	if (!numberToBeDisplayed) numberToBeDisplayed = "0";

	if (numberToBeDisplayed.length > 8) {
		const numberArr = (+numberToBeDisplayed).toExponential(1).split("e");
		currentDisplayed.innerHTML = `${numberArr[0]} x 10<sup>${+numberArr[1]}<sup/>`;
	} else {
		const number = +numberToBeDisplayed || 0;
		currentDisplayed.textContent =
			number.toLocaleString("en-US", {
				minimumFractionDigits: numberToBeDisplayed.split(".")[1]?.length || 0,
			}) + (currentDisplayed.textContent.includes(".") ? "" : addition);
	}
}

function preHandle(button) {
	if (button === "=" && (previousKey === "=" || previousKey === "Enter")) return;

	handleButtonClick(button);

	if (button === ".") handleDisplayFormatting(".");
	else handleDisplayFormatting();

	handlePreviousFormatting();

	if (button === "=") numberToBeDisplayed = "";
}

//LISTENERS
themeSwitcher.addEventListener("click", handleThemeSwitching);
keypad.addEventListener("click", function (e) {
	preHandle(e.target.textContent);
	previousKey = e.target.textContent;
});

document.addEventListener("keydown", function (e) {
	if (!ALL_OPERATIONS.includes(e.key) && !ALL_DIGITS.includes(e.key) && !KEYBOARD_BTNS.includes(e.key)) return;

	if (e.key === "*") preHandle("x");
	if (e.key === "Backspace") preHandle("DEL");
	if (e.key === "Enter") preHandle("=");
	else preHandle(e.key);

	previousKey = e.key;
});

//START
function init() {
	initTheme();
}

init();
