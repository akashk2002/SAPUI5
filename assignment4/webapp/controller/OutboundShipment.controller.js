sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("assignment4.controller.OutboundShipment", {
        onInit: function () {
            var oModel = this.getView().getModel();
            if (!oModel) {
                console.error("Model is not set on the view.");
            }
        },

        onContinue: function (oEvent) {
            var sButtonId = oEvent.getSource().getId();
            var oModel = this.getView().getModel();
            var sShipmentId = oModel ? oModel.getProperty("/shipmentId") : null;

            console.log("Button ID:", sButtonId);
            console.log("Shipment ID:", sShipmentId);

            if (sButtonId.includes("continueButton")) {
                if (sShipmentId && sShipmentId.length === 8) {
                    console.log("Valid Shipment ID entered:", sShipmentId);
                    this.getOwnerComponent().getRouter().navTo("LoadConfirmation");
                } else {
                    console.log("Invalid Shipment ID entered:", sShipmentId);
                    this.byId("invalidShipmentDialog").open();
                }
            } else if (sButtonId.includes("noShipmentIdButton")) {
                this.byId("noShipmentIdDialog").open();
            } else if (sButtonId.includes("helpButton")) {
                MessageToast.show("Please contact support for assistance.");
            } else if (sButtonId.includes("cancelButton")) {
                if (oModel) {
                    oModel.setProperty("/shipmentId", "");
                }
                MessageToast.show("Shipment ID entry has been cleared.");
            }
        },

        onNavBack: function () {
            window.history.go(-1);
        },

        onHelp: function () {
            if (!this._helpDialog) {
                this._helpDialog = this.byId("helpDialog");
            }
            this._helpDialog.open();
        },

        onCloseHelpDialog: function () {
            this.byId("helpDialog").close();
        },

        onCloseInvalidShipmentDialog: function () {
            this.byId("invalidShipmentDialog").close();
        },

        onCloseNoShipmentIdDialog: function () {
            this.byId("noShipmentIdDialog").close();
        }
    });
});