
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("com.yash.assignment8.controller.Employee", {
        onInit: function (oEvent) {
            // Initialize the controller and fetch the employees count
            this.fetchEmployeessCount();

            // Get the router for navigation
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        },

        fetchEmployeessCount: function () {
            // Fetch the count of employees from the model
            var oModel = this.getOwnerComponent().getModel(); 
            oModel.read("/Employees/$count", {
                success: (data) => {
                    var EmployeesCount = parseInt(data);
                    console.log("Emp count:", EmployeesCount);
                    // Update the UI with the employees count
                    this.getView().byId("employeesCount").setText(" Total Employees ( " + EmployeesCount + " )");
                },
                error: (error) => {
                    console.error("Error fetching categories count:", error);
                }
            });
        },

        EmployeeSelect: function (oEvent) {
            // Handle employee selection
            var oSelectedItem = oEvent.getParameter("listItem");
            var sEmployeeID = oSelectedItem.getTitle();
            console.log("emp id: ", sEmployeeID);
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/Employees(" + sEmployeeID + ")/Orders"; // Adjusted to fetch orders directly

            // Fetch orders for the selected employee
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

            this.byId("ordersCount").setVisible(true);
            var sPath1 = "/Employees(" + sEmployeeID + ")/Orders/$count";
            oModel.read(sPath1, {
                success: (data) => {
                    var OrdersCount = parseInt(data);
                    console.log("Emp count:", OrdersCount);
                    // Update the UI with the orders count
                    this.getView().byId("ordersCount").setText(" Total Orders ( " + OrdersCount + " )");
                },
                error: (error) => {
                    console.error("Error fetching categories count:", error);
                }
            });
        },

        OrderSelect: function (oEvent) {
            // Handle order selection
            var oSelectedItem = oEvent.getParameter("listItem");
            var sOrderID = oSelectedItem.getTitle();
            console.log("emp id: ", sOrderID);
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/Orders(" + sOrderID + ")/Order_Details"; // Adjusted to fetch orders directly

            // Fetch order details for the selected order
            oModel.read(sPath, {
                success: (oData) => {
                    var oProductModel = new JSONModel({
                        Order_Details: oData.results
                    });
                    console.log("Order Model: ", oProductModel);
                    this.getView().setModel(oProductModel, "productData");
                },
                error: (oError) => {
                    console.error("Error fetching orders data:", oError);
                }
            });

            this.byId("productsCount").setVisible(true);
            var sPath1 = "/Orders(" + sOrderID + ")/Order_Details/$count";
            oModel.read(sPath1, {
                success: (data) => {
                    var PoductsCount = parseInt(data);
                    console.log("Proct count:", PoductsCount);
                    // Update the UI with the products count
                    this.getView().byId("productsCount").setText(" Total Products ( " + PoductsCount + " )");
                },
                error: (error) => {
                    console.error("Error fetching categories count:", error);
                }
            });
        },

        async onSortPress() {
            // Open the sort dialog
            this._oDialog ??= await this.loadFragment({
                name: "com.yash.assignment8.view.Popovers.SortFragment"
            });
            this._oDialog.open();
        },

        onOKSort: function() {
            // Handle sorting confirmation
            var sortOrder = this.byId("sortOrder").getSelectedButton().getText();
            var sortBy = this.byId("sortBy").getSelectedButton().getId();
        
            // Determine the property to sort by based on the selected sortBy option
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
        
            // Sort the table model
            var oTable = this.byId("list");
            var oBinding = oTable.getBinding("items");
            var aSorters = [];
        
            // Create sorter based on the selected sortOrder
            aSorters.push(new sap.ui.model.Sorter(sortProperty, sortOrder === "Descending"));
        
            // Apply the sorter to the binding
            oBinding.sort(aSorters);
        
            this._oDialog.close();
        },
        
        onCancelSort: function() {
            // Handle sorting cancellation
            this._oDialog.close();
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

        onSearch: function (oEvent) {
            // Handle search functionality
            var sQuery = oEvent.getParameter("query");
            var oList = this.byId("list");
            var oBinding = oList.getBinding("items");
            var aFilters = [];
        
            if (sQuery) {
                // Create filter for FirstName
                var oFilterFirstName = new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery);
                
                // Add the filter to the filters array
                aFilters.push(oFilterFirstName);
            }
        
            // Apply filters to the list binding
            oBinding.filter(aFilters);
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
