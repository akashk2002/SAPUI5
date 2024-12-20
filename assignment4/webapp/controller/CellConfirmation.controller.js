sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("assignment.controller.CellConfirmation", {
        onContinue: function () {
            this.getOwnerComponent().getRouter().navTo("TrailerType");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("CellPhoneEntry");
        }
    });
});