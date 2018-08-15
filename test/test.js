/*
 * Copyright (C) 2018 ExE Boss
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
/* eslint no-unused-vars: 0 */
/* global runTest */

function exportFunction() {}

const logger = (() => {

/**
 * @param {string} element
 * @param {string} text
 * @return {HTMLElement}
 */
function createTextElement(element, text) {
	const result = document.createElement(element);
	result.appendChild(document.createTextNode(text));
	return result;
}

/**
 * @param {string} level
 * @param {string} message
 * @return {HTMLDivElement}
 */
function createLogLine(level, message) {
	level = level.toLowerCase();

	const div = document.createElement("div");
	div.classList.add("log-line");
	div.dataset.level = level;

	const logLevel = createTextElement("span", `[${level.toUpperCase()}] `);
	logLevel.classList.add("log-level");

	const logMessage = createTextElement("span", message);
	logMessage.classList.add("log-message");

	div.appendChild(logLevel);
	div.appendChild(logMessage);
	return div;
}

let results;

class Logger {
	constructor() {
		this._backlog = [];
	}

	error (...message)	{ this._log("error",	...message);	}
	warn (...message)	{ this._log("warn",	...message);	}
	log (...message)	{ this._log("log",	...message);	}
	info (...message)	{ this._log("info",	...message);	}
	debug (...message)	{ this._log("debug",	...message);	}

	_log(level, ...message) {
		try {console[level.toLowerCase()](...message);} catch (e) {}
		const msg = createLogLine(level, `${message.join(" ")}`);
		if (!results) {
			this._backlog.push(msg);
			return;
		}
		this._flush();
		results.appendChild(msg);
	}

	_flush() {
		while (this._backlog.length > 0) {
			results.appendChild(this._backlog.shift());
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	results = document.getElementById("test");
	logger._flush();

	runTest();
});

return new Logger();
})();

function is(value, expected, failMessage) {
	if (value !== expected) {
		logger.error(failMessage, "\nwas:", value, "\nexpected:", expected);
	}
}

function ok(value, failMessage) {
	if (!value) {
		logger.error(failMessage, "\nwas:", value, "\nexpected: any Truthy type");
	}
}
