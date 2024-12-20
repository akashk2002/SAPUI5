sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("assignment4.controller.PPEPolicies", {
        onContinue: function () {
            this.getOwnerComponent().getRouter().navTo("CheckInConfirmation");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("TarpingRequirements");
        }
    });
});