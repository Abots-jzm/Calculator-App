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

//LISTENERS
themeSwitcher.addEventListener("click", function () {
	currentTheme++;
	if (currentTheme > 3) currentTheme = 1;

	moveSwitch(currentTheme);

	const themeStr = `t${currentTheme}`;
	setTheme(themeStr);

	localStorage.setItem("theme", themeStr);
});

//START
function init() {
	initTheme();
}

init();
