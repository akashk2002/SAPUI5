/*global QUnit*/

sap.ui.define([
	"assignment2/controller/a2.controller"
], function (Controller) {
	"use strict";

	QUnit.module("a2 Controller");

	QUnit.test("I should test the a2 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
