/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comyash/assignment7/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
