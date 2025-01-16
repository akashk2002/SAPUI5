sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("com.yash.assignment8.controller.Supplier", {
        onInit: function (oEvent) {

            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
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
            this.oRouter.navTo("Product")
        },

        async onSelectDialogPress() {
            this._oDialog ??= await this.loadFragment({
                name: "com.yash.assignment8.view.Popovers.SupplierDetails"
            });
            this._oDialog.open()
        },

        onRowsSelection: function () {
            var oTable = this.byId("tableFrag");
            var aSelectedItems = oTable.getSelectedItems();
        
           
            var sSelectedText = "Selected: " + aSelectedItems.length;
            this.byId("selectedCount").setText(sSelectedText);
        },

        onSelectPress: function () {
            var oTableFrag = this.byId("tableFrag");
            var aSelectedItems = oTableFrag.getSelectedItems();
            var oModel = this.getView().getModel("selectedSuppliers");
            if (!oModel) {
                oModel = new JSONModel({
                    Suppliers: []
                });
                this.getView().setModel(oModel, "selectedSuppliers");
            }
        
            oModel.setProperty("/Suppliers", []);
        
            var aNewSuppliers = [];
            aSelectedItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext();
                var oSupplierData = oContext.getObject();
                aNewSuppliers.push(oSupplierData);
            });
        
            oModel.setProperty("/Suppliers", aNewSuppliers);
        
            this._oDialog.close();
        },
        
        
        onCancelPress: function() {
            this._oDialog.close();
        },
        
        onDelete: function (oEvent) {
            var oTable = oEvent.getSource();
            var oItem = oEvent.getParameter("listItem");
            var sPath = oItem.getBindingContextPath();
            var oModel = this.getView().getModel("selectedSuppliers");
            var aData = oModel.getProperty("/Suppliers");
        
            var iIndex = sPath.split("/").pop();
        
            sap.m.MessageBox.confirm(
                "Are you sure you want to delete this item?",
                {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    initialFocus: sap.m.MessageBox.Action.NO,
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            aData.splice(iIndex, 1);
                            oModel.setProperty("/Suppliers", aData);
        
                            sap.m.MessageToast.show("Row deleted successfully.");
                        } else {
                            sap.m.MessageToast.show("Row deletion cancelled.");
                        }
                    }
                }
            );
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
