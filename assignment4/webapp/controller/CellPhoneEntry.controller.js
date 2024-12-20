sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("assignment4.controller.CellPhoneEntry", {
        onContinue: function () {
            var oModel = this.getView().getModel();
            var part1 = oModel.getProperty("/cellPhonePart1");
            var part2 = oModel.getProperty("/cellPhonePart2");
            var part3 = oModel.getProperty("/cellPhonePart3");
            var cellPhone = part1 + part2 + part3;

            if (this._isValidCellPhone(cellPhone)) {
                oModel.setProperty("/cellPhone", cellPhone);
                this.byId("cellConfirmationDialog").open();
            } else {
                MessageToast.show("Please enter a valid cell phone number.");
            }
        },

        _isValidCellPhone: function (cellPhone) {
            // Simple validation: check if the cell phone number is a 10-digit number
            var phoneRegex = /^\d{10}$/;
            return phoneRegex.test(cellPhone);
        },

        onInputChange: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oSource = oEvent.getSource();
            var sId = oSource.getId();

            if (sValue.length === oSource.getMaxLength()) {
                if (sId.includes("inputPart1")) {
                    this.byId("inputPart2").focus();
                } else if (sId.includes("inputPart2")) {
                    this.byId("inputPart3").focus();
                }
            }
        },

        onConfirm: function () {
            this.byId("cellConfirmationDialog").close();
            this.getOwnerComponent().getRouter().navTo("TrailerType");
        },

        onCloseCellConfirmationDialog: function () {
            this.byId("cellConfirmationDialog").close();
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("LoadConfirmation");
        },

        onStartOver: function () {
            this.getOwnerComponent().getRouter().navTo("Welcome");
        }
    });
});