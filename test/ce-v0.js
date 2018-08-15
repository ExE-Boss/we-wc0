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

function checkElement(element, htmlElement, constructor, type) {
	is(Object.getPrototypeOf(element).constructor, htmlElement, `${type} should be a direct subclass of ${htmlElement}`);
	ok(element instanceof constructor, `${type} should be an instance of ${constructor}`);
}

const TestUnknownElement = document.registerElement("test-unknown");
const TestGenericElement = document.registerElement("test-generic", {
	prototype: Object.create(
		HTMLElement.prototype
	)
});
const TestDivElement = document.registerElement("test-div", {
	extends: "div",
	prototype: Object.create(
		HTMLDivElement.prototype
	),
});
const TestCallbacksElement_createdCallback = sinon.stub();
const TestCallbacksElement_attachedCallback = sinon.stub();
const TestCallbacksElement_detachedCallback = sinon.stub();
const TestCallbacksElement = document.registerElement("test-callbacks", {
	prototype: Object.create(
		HTMLElement.prototype,
		{
			createdCallback:	{ value:	TestCallbacksElement_createdCallback	},
			attachedCallback:	{ value:	TestCallbacksElement_attachedCallback	},
			detachedCallback:	{ value:	TestCallbacksElement_detachedCallback	},
		}
	),
});

function runTest() {
	let element = new TestUnknownElement();
	checkElement(element, HTMLElement, TestUnknownElement, "instantiated test-unknown element");

	element = document.getElementById("unknown-1");
	checkElement(element, HTMLElement, TestUnknownElement, "parsed test-unknown element");



	element = new TestGenericElement();
	checkElement(element, HTMLElement, TestGenericElement, "instantiated test-generic element");

	element = document.getElementById("generic-1");
	checkElement(element, HTMLElement, TestGenericElement, "parsed test-generic element");



	element = new TestDivElement();
	checkElement(element, HTMLDivElement, TestDivElement, "instantiated test-div element");

	element = document.getElementById("div-1");
	checkElement(element, HTMLDivElement, TestDivElement, "parsed test-div element");



	element = new TestCallbacksElement();
	checkElement(element, HTMLElement, TestCallbacksElement, "instantiated test-callbacks element");

	element = document.getElementById("callbacks-1");
	checkElement(element, HTMLElement, TestCallbacksElement, "parsed test-callbacks element");

	is(TestCallbacksElement_createdCallback.callCount, 2, "Expected TestCallbacksElement constructor to have been called twice");
	is(TestCallbacksElement_attachedCallback.callCount, 1, "Expected TestCallbacksElement attached callback to have been called once");
	is(TestCallbacksElement_detachedCallback.callCount, 0, "Expected TestCallbacksElement detached callback to have not been called");
}
