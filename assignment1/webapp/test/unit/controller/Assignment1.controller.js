/*global QUnit*/

sap.ui.define([
	"assignment1/controller/Assignment1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Assignment1 Controller");

	QUnit.test("I should test the Assignment1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
