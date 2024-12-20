sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("assignment4.controller.TrackNumberEntry", {
        onInit: function () {
            // Initialization code, if needed
        },

        onBack: function () {
            // Logic to navigate back
            sap.m.MessageToast.show("Navigating back...");
            // Add your navigation logic here
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        onContinue: function () {
            // Logic to navigate to the cell phone entry page
            sap.m.MessageToast.show("Navigating to Cell Phone Entry page...");
            // Add your navigation logic here
            this.getOwnerComponent().getRouter().navTo("CellPhoneEntry");
        }
    });
});