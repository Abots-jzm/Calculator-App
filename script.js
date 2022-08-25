"use strict";

const ALL_DIGITS = "1234567890.";
const ALL_OPERATIONS = "x/-+";

const themeSwitcher = document.querySelector(".switch--background");
const switchHead = document.querySelector(".switch");
const keypad = document.querySelector(".keypad");
const previousDisplayed = document.querySelector(".display--previous");
const currentDisplayed = document.querySelector(".display--active");

let previousOperation;
let storedNumber;
let currentTheme = 1;
let numberToBeDisplayed = "";
let previousToBeDisplayed = previousDisplayed.textContent;

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
	if (!previousToBeDisplayed.trim()) {
		storedNumber = +numberToBeDisplayed;
		previousToBeDisplayed = `${numberToBeDisplayed} ${operation}`;
		numberToBeDisplayed = "";
		previousOperation = operation;
		return;
	}

	let result;
	switch (previousOperation) {
		case "+":
			result = storedNumber + +numberToBeDisplayed;
			break;
		case "-":
			result = storedNumber - +numberToBeDisplayed;
			break;
		case "/":
			result = storedNumber / +numberToBeDisplayed;
			break;
		case "x":
			result = storedNumber * +numberToBeDisplayed;
			break;
	}

	previousToBeDisplayed = `${result} ${operation}`;
	storedNumber = result;
	numberToBeDisplayed = "";
	previousOperation = operation;
}

function handleButtonClick(e) {
	const buttonClicked = e.target.textContent;

	if (numberToBeDisplayed.replace(".", "").length > 7 && buttonClicked !== "DEL") return;

	if (!ALL_DIGITS.includes(buttonClicked)) {
		if (buttonClicked === "DEL") handleDelete();

		if (ALL_OPERATIONS.includes(buttonClicked)) handleOperation(buttonClicked);

		return;
	}

	if (numberToBeDisplayed === "0" && buttonClicked !== ".") {
		numberToBeDisplayed = buttonClicked;
		return;
	}

	if (buttonClicked === "." && numberToBeDisplayed.includes(".")) return;

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
	const number = +numberToBeDisplayed || 0;
	currentDisplayed.textContent =
		number.toLocaleString("en-US", {
			minimumFractionDigits: numberToBeDisplayed.split(".")[1]?.length || 0,
		}) + (currentDisplayed.textContent.includes(".") ? "" : addition);
}

//LISTENERS
themeSwitcher.addEventListener("click", handleThemeSwitching);
keypad.addEventListener("click", function (e) {
	handleButtonClick(e);

	if (e.target.textContent === ".") handleDisplayFormatting(".");
	else handleDisplayFormatting();

	handlePreviousFormatting();
});

//START
function init() {
	initTheme();
}

init();
