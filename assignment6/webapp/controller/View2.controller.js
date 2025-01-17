sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox'
], function(Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("assignment6.controller.View2", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteView2").attachPatternMatched(this._onObjectMatched, this);
            this._selectedPaymentMethod = null;
            var model = new JSONModel();
            this.getView().setModel(model, "view");
        },

        _onObjectMatched: function (oEvent) {
            var sSelectedItems = oEvent.getParameter("arguments").selectedItems;
            if (sSelectedItems) {
                try {
                    var aSelectedItems = JSON.parse(sSelectedItems);
                    var oModel = this.getView().getModel("view");
                    oModel.setProperty("/items", aSelectedItems);
                } catch (e) {
                    MessageBox.error("Failed to parse selected items data.");
                }
            } else {
                MessageBox.error("No items were passed to the view.");
            }
        },

        onPaymentMethodSelect: function (oEvent) {
            var sNewPaymentMethod = oEvent.getSource().data("key");

            if (this._selectedPaymentMethod && this._selectedPaymentMethod !== sNewPaymentMethod) {
                MessageBox.confirm("Are you sure you want to change the payment method?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._selectedPaymentMethod = sNewPaymentMethod;
                            this.getView().getModel("view").setProperty("/selectedPaymentMethod", sNewPaymentMethod);
                        }
                    }.bind(this)
                });
            } else {
                this._selectedPaymentMethod = sNewPaymentMethod;
                this.getView().getModel("view").setProperty("/selectedPaymentMethod", sNewPaymentMethod);
            }
        },

        onReviewOrder: function () {
            var oView = this.getView();
            var oModel = oView.getModel("view");

            // Collect credit card details
            oModel.setProperty("/cardHolderName", oView.byId("cardHolderName").getValue());
            oModel.setProperty("/creditCardNumber", oView.byId("creditCardNumber").getValue());
            oModel.setProperty("/expiryDate", oView.byId("expiryDate").getValue());
            oModel.setProperty("/securityCode", oView.byId("securityCode").getValue());

            // Collect invoice address
            oModel.setProperty("/invoiceAddress", {
                street: oView.byId("street").getValue(),
                city: oView.byId("city").getValue(),
                postalCode: oView.byId("postalCode").getValue()
            });

            // Collect delivery type
            oModel.setProperty("/deliveryType", oView.byId("deliveryType").getSelectedItem().getText());

            var oWizard = this.byId("wizard");
            var oReviewStep = oWizard.getSteps()[5]; // Assuming the review step is the 6th step
            oWizard.goToStep(oReviewStep);
        },

        onPlaceOrder: function () {
            MessageBox.success("Order placed successfully!");
        }
    });
});