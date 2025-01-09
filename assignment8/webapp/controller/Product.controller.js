
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("com.yash.assignment8.controller.Product", {
        onInit: function (oEvent) {
            // Initialize the router for navigation
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        },

        Language: function(oEvent) {
            // Open the language selection popover
            var oButton = oEvent.getSource();
            if (!this._oPopover) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.yash.assignment8.view.Popovers.Language",
                    controller: this
                }).then(function(oPopover) {
                    this._oPopover = oPopover;
                    this.getView().addDependent(this._oPopover);
                    this._oPopover.openBy(oButton);
                }.bind(this));
            } else {
                this._oPopover.openBy(oButton);
            }
        },

        async Version() {
            // Open the version dialog
            if (!this._oDialogVer) {
                this._oDialogVer = await this.loadFragment({
                    name: "com.yash.assignment8.view.Popovers.VersionID"
                });
                const oManifest = this.getOwnerComponent().getManifest();
                const sAppVersion = oManifest["sap.ui5"].dependencies.minUI5Version;
        
                this._oDialogVer.setModel(new JSONModel({
                    version: sAppVersion
                }), "fragmentData");
                this.getView().addDependent(this._oDialogVer);
            }
            this._oDialogVer.open();
        },

        onOKVersion: function() {
            // Handle version dialog confirmation
            this._oDialogVer.close();
        },

        Backbtn: function() {
            // Navigate back to the previous view
            this.oRouter.navTo("RouteView2");
        },

        onProductDetails: function (oEvent) {
            // Get the binding context from the selected item
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();

            // Extract the product ID from the selected item
            var sProductId = oBindingContext.getProperty("ProductID");

            // Retrieve the data for the selected product
            var oModel = this.getView().getModel();
            var sPath = `/Products(${sProductId})`;
            var oProductData = oModel.getProperty(sPath);

            // Create or fetch the Popover fragment
            if (!this._oPopover) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.yash.assignment8.view.Popovers.Product",
                    controller: this
                }).then(function (oPopover) {
                    this._oPopover = oPopover;
                    this.getView().addDependent(this._oPopover);
                    this._openPopover(oItem);
                }.bind(this));
            } else {
                this._openPopover(oItem);
            }
        },

        _openPopover: function (oItem) {
            // Set the model for the popover and open it
            this._oPopover.setModel(new sap.ui.model.json.JSONModel(this.getView().getModel().getProperty(`/Products(${oItem.getBindingContext().getProperty("ProductID")})`)), "productDetails");
            this._oPopover.openBy(oItem);
        },
        
        EmployeeBtn: function() {
            // Navigate to the Employee view
            this.oRouter.navTo("Employee");
        },

        CustomerBtn: function() {
            // Navigate to the Customer view
            this.oRouter.navTo("Customer");
        },

        ProductBtn: function() {
            // Navigate to the Product view
            this.oRouter.navTo("Product");
        },

        SupplierBtn: function() {
            // Navigate to the Supplier view
            this.oRouter.navTo("Supplier");
        },
    });
});
