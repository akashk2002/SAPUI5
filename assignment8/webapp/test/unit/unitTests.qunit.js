/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"assignment8/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});