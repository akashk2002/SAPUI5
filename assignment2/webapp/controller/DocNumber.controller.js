sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("assignment2.controller.DocNumber", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("docNumber").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var docNumber1 = oEvent.getParameter("arguments").docNumber;
            this.getView().byId("docNumber").setValue(docNumber1);
        },

        onBackPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Routea2"); // Navigate back to the main route
        }
    });
});