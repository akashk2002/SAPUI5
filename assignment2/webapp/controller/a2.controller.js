sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("assignment2.controller.a2", {
        onSiteChange: function () {
            this.byId("documentTypeVBox").setVisible(true);
            this._generateProposedNumber();
        },

        onDocumentTypeChange: function () {
            this.byId("departmentVBox").setVisible(true);
            this._generateProposedNumber();
        },

        onDepartmentChange: function () {
            this.byId("customerVBox").setVisible(true);
            this._generateProposedNumber();
        },

        onInputChange: function () {
            this._generateProposedNumber();
        },

        _generateProposedNumber: function () {
            var site = this.byId("site").getSelectedKey();
            var documentType = this.byId("documentType").getSelectedKey();
            var department = this.byId("department").getSelectedKey();
            var customer = this.byId("customer").getSelectedKey();

            var proposedNumber = site + "-" + documentType + "-" + department + "-" + customer;
            this.byId("proposedNumber").setValue(proposedNumber);
        },

        onNextPress: function () {
            var site = this.byId("site").getSelectedKey();
            var documentType = this.byId("documentType").getSelectedKey();
            var department = this.byId("department").getSelectedKey();

            if (!site || !documentType || !department) {
                MessageBox.error("Please fill in all required fields (Site, Document Type, and Department).");
                return;
            }

            var proposedNumber = this.byId("proposedNumber").getValue();

            // Navigate to the new page with the proposed number
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("docNumber", {
                docNumber: proposedNumber
            });

            MessageToast.show("Navigating to the Doc Number page.");
        }
    });
});