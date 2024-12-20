sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("assignment4.controller.TarpingRequirements", {
        onContinue: function () {
            this.getOwnerComponent().getRouter().navTo("PPEPolicies");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("TrailerType");
        }
    });
});