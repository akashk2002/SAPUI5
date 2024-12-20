sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("assignment4.controller.TrailerType", {
        onNavBack: function () {
            // Navigate back to the previous view
            this.getOwnerComponent().getRouter().navTo("CellPhoneEntry");
        },

        onStartOver: function () {
            // Reset the model data and navigate to the initial view
            var oModel = this.getView().getModel();
            oModel.setProperty("/cellPhone", "");
            oModel.setProperty("/selectedTrailerType", 0);
            this.getOwnerComponent().getRouter().navTo("Welcome");
            MessageToast.show("Starting over. Please enter your details again.");
        },

        onSelectTrailerType: function (oEvent) {
            var sTrailerType = oEvent.getSource().getText();
            var oModel = this.getView().getModel();
            oModel.setProperty("/selectedTrailerType", sTrailerType);
            this.getOwnerComponent().getRouter().navTo("TarpingRequirements");
        }
    });
});