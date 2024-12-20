sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("assignment4.controller.CheckInConfirmation", {
        onInit: function () {
            // Initialization code, if needed
        },

        onMainMenu: function () {
            // Logic to navigate to the main menu
            sap.m.MessageToast.show("Navigating to Main Menu...");
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }
    });
});