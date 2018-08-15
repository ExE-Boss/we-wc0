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

(async () => {
// Short‑circuit if the polyfill can’t be used
if ("registerElement" in document) return;
else if (window.customElements) {
	/** @typedef	{object}	ElementCreationOptions
	 * @property	{HTMLElement}	[prototype]
	 * @property	{string[]}	[observedAttributes]
	 */
	/**
	 * @param {string} name
	 * @param {ElementCreationOptions} [options]
	 * @return {HTMLElement}
	 */
	const registerElement = (name, options = {}) => {
		const proto = ("prototype" in options) ? options.prototype : HTMLElement.prototype;
		const Constructor = proto.constructor;

		const {
			createdCallback: created,
			attachedCallback: attached,
			detachedCallback: detached,
			attributeChangedCallback: attributeChanged,
		} = proto;

		/**
		 * @param {string} name
		 * @param {*} value
		 */
		const defineWrapperProperty = (name, value) => {
			Object.defineProperty(CustomElementV0.prototype, name, {
				configurable: true,
				writable: true,
				value,
			});
		};

		function CustomElementV0(...args) {
			return Reflect.construct(
				Constructor,
				args,
				CustomElementV0,
			).createdCallback();
		}
		CustomElementV0.prototype = Object.create(proto);
		defineWrapperProperty("createdCallback", created
			? function() { return created.call(this), this; }
			: function() { return this; });

		if (attached)	defineWrapperProperty("connectedCallback",	attached);
		if (detached)	defineWrapperProperty("disconnectedCallback",	detached);
		if (attributeChanged)	defineWrapperProperty("attributeChangedCallback",	attributeChanged);

		if ("observedAttributes" in options) {
			Object.defineProperty(CustomElementV0, "observedAttributes", {
				configurable: true,
				get() {
					return options.observedAttributes;
				},
			});
		}

		let nativeOptions = undefined;
		if ("extends" in options) {
			nativeOptions = {
				extends: options.extends,
			};
		}
		window.customElements.define(name, CustomElementV0, nativeOptions);
		return CustomElementV0;
	};
	document.registerElement = registerElement;

	const Document_wrappedJSObject_registerElement = function registerElement(tagName, options) {
		document.registerElement(tagName, options);
	};
	exportFunction(Document_wrappedJSObject_registerElement, document, {defineAs: "registerElement"});
}
})();
