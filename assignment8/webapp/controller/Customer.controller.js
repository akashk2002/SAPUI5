sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("com.yash.assignment8.controller.View2", {
        onInit: function (oEvent) {

            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
            this.fetchCustomersCount()
        },

        fetchCustomersCount: function () {
            var oModel = this.getOwnerComponent().getModel(); 
            oModel.read("/Customers/$count", {
                success: (data) => {
                    var CustomersCount = parseInt(data);
                    console.log("Cus count:", CustomersCount);
                    this.getView().byId("customersCount").setText(" Total Customers: ( " + CustomersCount + " )");
                },
                error: (error) => {
                    console.error("Error fetching categories count:", error);
                }
            })
        },

        async onSortPress() {
            this._oDialog ??= await this.loadFragment({
                name: "com.yash.assignment8.view.Popovers.Customer"
            });
            this._oDialog.open()
        },

        onOKCusSort: function() {
            var sortOrder = this.byId("sortOrder").getSelectedButton().getText();
            var sortBy = this.byId("sortBy").getSelectedButton().getId();
        
            // Determine the property to sort by based on the selected sortBy option
            var sortProperty;
            switch (sortBy) {
                case this.getView().createId("customerId"):
                    sortProperty = "CustomerID";
                    break;
                case this.getView().createId("comName"):
                    sortProperty = "CompanyName";
                    break;
                case this.getView().createId("conName"):
                    sortProperty = "ContactName";
                    break;
                case this.getView().createId("city"):
                    sortProperty = "City";
                    break;
                default:
                    sortProperty = "CustomerID"; 
                    break;
            }
        
            // Sort the table model
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
            var aSorters = [];
        
            // Create sorter based on the selected sortOrder
            aSorters.push(new sap.ui.model.Sorter(sortProperty, sortOrder === "Descending"));
        
            // Apply the sorter to the binding
            oBinding.sort(aSorters);
        
            this._oDialog.close();
        },
        
        onCancelCusSort: function() {
            this._oDialog.close();
        },

        Language: function(oEvent) {
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
            this._oDialogVer.close();
        },

        Backbtn: function() {
            this.oRouter.navTo("RouteView1")
        },

        onTableSelectionChange: function (oEvent) {
            this.byId("objectHeader").setVisible(true)
            this.byId("img").setVisible(true)
            var oSelectedItem = oEvent.getParameter("listItem");
            if (oSelectedItem) {
                var oBindingContext = oSelectedItem.getBindingContext();
                var oData = oBindingContext.getObject();

                this.getView().byId("custId").setText("Customer ID:  " +  oData.CustomerID);
                this.getView().byId("companyName").setText("Company Name:  " + oData.CompanyName);
                this.getView().byId("contactName").setText("Contact Name:  " + oData.ContactName);
                this.getView().byId("contactTitle").setText("Contact Title:  " + oData.ContactTitle);
            }
        },

        EmployeeBtn: function() {
            this.oRouter.navTo("Employee")
        },

        CustomerBtn: function() {
            this.oRouter.navTo("Customer")
        },

        ProductBtn: function() {
            this.oRouter.navTo("Product")
        },

        SupplierBtn: function() {
            this.oRouter.navTo("Supplier")
        },


    });
});
