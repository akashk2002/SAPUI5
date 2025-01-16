sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("com.yash.assignment8.controller.Employee", {
        onInit: function (oEvent) {
            
            this.fetchEmployeessCount();

            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
        },

        fetchEmployeessCount: function () {
            var oModel = this.getOwnerComponent().getModel(); 
            oModel.read("/Employees/$count", {
                success: (data) => {
                    var EmployeesCount = parseInt(data);
                    console.log("Emp count:", EmployeesCount);
                    this.getView().byId("employeesCount").setText(" Employees ( " + EmployeesCount + " )");
                },
                error: (error) => {
                    console.error("Error fetching categories count:", error);
                }
            })
        },

        EmployeeSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var sEmployeeID = oSelectedItem.getTitle();
            console.log("emp id: ", sEmployeeID)
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/Employees(" + sEmployeeID + ")/Orders"; // Adjusted to fetch orders directly

            oModel.read(sPath, {
                success: (oData) => {
                    var oOrderModel = new JSONModel({
                        Orders: oData.results
                    });
                    console.log("Order Model: ", oOrderModel);
                    this.getView().setModel(oOrderModel, "OrderData");
                },
                error: (oError) => {
                    console.error("Error fetching orders data:", oError);
                }
            });

            this.byId("ordersCount").setVisible(true)
            var sPath1 = "/Employees(" + sEmployeeID + ")/Orders/$count"
            oModel.read(sPath1, {
                success: (data) => {
                    var OrdersCount = parseInt(data);
                    console.log("Emp count:", OrdersCount);
                    this.getView().byId("ordersCount").setText(" Total Orders ( " + OrdersCount + " )");
                },
                error: (error) => {
                    console.error("Error fetching categories count:", error);
                }
            })
        },

        OrderSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var sOrderID = oSelectedItem.getTitle();
            console.log("emp id: ", sOrderID)
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/Orders(" + sOrderID + ")/Order_Details"; // Adjusted to fetch orders directly

            oModel.read(sPath, {
                success: (oData) => {
                    var oProductModel = new JSONModel({
                        Order_Details: oData.results
                    });
                    console.log("Order Model: ", oProductModel);
                    this.getView().setModel(oProductModel, "productData");
                },
                error: (oError) => {
                    console.error("Error", oError);
                }
            });

            this.byId("productsCount").setVisible(true)
            var sPath1 = "/Orders(" + sOrderID + ")/Order_Details/$count"
            oModel.read(sPath1, {
                success: (data) => {
                    var PoductsCount = parseInt(data);
                    console.log("Proct count:", PoductsCount);
                    this.getView().byId("productsCount").setText(" Products ( " + PoductsCount + " )");
                },
                error: (error) => {
                    console.error("Error fetching categories count:", error);
                }
            })
        },

        async onSortPress() {
            this._oDialog ??= await this.loadFragment({
                name: "com.yash.assignment8.view.Popovers.SortFragment"
            });
            this._oDialog.open()
        },

        async onSortPress2() {
            this._oDialog ??= await this.loadFragment({
                name: "com.yash.assignment8.view.Popovers.SortFragment2"
            });
            this._oDialog.open()
        },






        OKSort: function() {
            var sortOrder = this.byId("sortOrder").getSelectedButton().getText();
            var sortBy = this.byId("sortBy").getSelectedButton().getId();
        
            var sortProperty;
            switch (sortBy) {
                case this.getView().createId("employeeId"):
                    sortProperty = "EmployeeID";
                    break;
                case this.getView().createId("firstName"):
                    sortProperty = "FirstName";
                    break;
                case this.getView().createId("lastName"):
                    sortProperty = "LastName";
                    break;
                default:
                    sortProperty = "EmployeeID"; 
                    break;
            }
        
           
            var oTable = this.byId("list");
            var oBinding = oTable.getBinding("items");
            var aSorters = [];
        
            aSorters.push(new sap.ui.model.Sorter(sortProperty, sortOrder === "Descending"));
        
            oBinding.sort(aSorters);
        
            this._oDialog.close();
        },

        OrderOKSort: function() {
            var sortOrder = this.byId("sortOrderorder").getSelectedButton().getText();
            var sortBy = this.byId("sortByorder").getSelectedButton().getId();
        
            var sortProperty;
            switch (sortBy) {
                case this.getView().createId("orderId"):
                    sortProperty = "OrderID";
                    break;
               
                default:
                    sortProperty = "OrderID"; 
                    break;
            }
        
            var oTable = this.byId("l1");
            var oBinding = oTable.getBinding("items");
            var aSorters = [];
        
            aSorters.push(new sap.ui.model.Sorter(sortProperty, sortOrder === "Descending"));
        
            oBinding.sort(aSorters);
        
            this._oDialog.close();
        },
        
        CancelSort: function() {
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

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oList = this.byId("list");
            var oBinding = oList.getBinding("items");
            var aFilters = [];
        
            if (sQuery) {
                var oFilterFirstName = new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery);
                
                aFilters.push(oFilterFirstName);
            }
        
            oBinding.filter(aFilters);
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
