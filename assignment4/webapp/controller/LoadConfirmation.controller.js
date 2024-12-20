sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("assignment4.controller.LoadConfirmation", {
        onContinue: function () {
            this.getOwnerComponent().getRouter().navTo("CellPhoneEntry");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("OutboundShipment");
        },
        onStartOver: function () {
            this.getOwnerComponent().getRouter().navTo("Welcome");
        }
    });
});