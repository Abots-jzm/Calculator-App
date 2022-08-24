"use strict";

const themeSwitcher = document.querySelector(".switch--background");
const switchHead = document.querySelector(".switch");

let currentTheme = 1;

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

//LISTENERS
themeSwitcher.addEventListener("click", function (e) {
	currentTheme++;
	if (currentTheme > 3) currentTheme = 1;

	moveSwitch(currentTheme);
	setTheme(`t${currentTheme}`);
});

//START
function init() {
	setTheme("t1");
}

init();
