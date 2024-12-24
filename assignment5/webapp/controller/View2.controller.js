sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator,Fragment,JSONModel) {
    "use strict";
 
    return Controller.extend("com.yash.assignment5.controller.View2", {
        onInit: function () {
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteView2").attachPatternMatched(this._onRouteMatched, this);
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter1 = sap.ui.core.UIComponent.getRouterFor(this);

            this.oRouter2 = sap.ui.core.UIComponent.getRouterFor(this);
            // Assuming you have a model named "Employees" set in your manifest or component
            var oModel = this.getOwnerComponent().getModel("Employees");
            this.getView().setModel(oModel, "Employees");
        
            this.aFilters = [];
        
            
            this.oFilterBar = this.getView().byId("filterbar");
            this.oTable = this.getView().byId("table");

            this.oTable1 = this.getView().byId("tableTerritories");

            
            this.oFilterBar.attachSearch(this.onSearch.bind(this));
            this.oTable.attachItemPress(this.onItemPress.bind(this));
            this.oTable1.attachItemPress(this.onItemPress1.bind(this));
        },
        
        _onRouteMatched: function(oEvent) {
            var argument = oEvent.getParameter("arguments").EmployeeID;
            var sPath = "/Employees(" + argument + ")";
            this.getView().bindElement({
                path: sPath,
            });

            var oModel = this.getView().getModel();
            var sPath1 = "/Employees(" + argument + ")/Orders";
            console.log("ARG : ", argument);
            oModel.read(sPath1, {
                success: function(oData) {
                    var oOrderModel = new sap.ui.model.json.JSONModel({
                        Orders: oData.results
                    });
                    console.log("OMODEL : ", oOrderModel);
                    this.getView().setModel(oOrderModel, "OrderData");
                }.bind(this),
                error: function(oError) {
                    console.log("Error in getting data",oError)
                }
                    
                });
           
        },
        
        onBackToView1: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
 
        formatDate: function (date) {
            if (!date) {
                return "";
            }
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ style: "long" });
            return oDateFormat.format(date);
        },
 
        onEditPress: function () {
            this.byId("birthdate").setEditable(true);
            this.byId("address").setEditable(true);
            this.byId("PostalCode").setEditable(true);
            this.byId("extension").setEditable(true);

            // var iconTabBar = this.byId("iconTabBar");
            // var items = iconTabBar.getItems();
            // items.forEach(function (item) {
            //     var content = item.getContent();
            //     content.forEach(function (control) {
            //         if (control instanceof sap.m.Input) {
            //             control.setEditable(true);
            //         } else if (control instanceof sap.m.ComboBox) {
            //             control.setEnabled(true);
            //         }
            //     });
            // });
 
            this.byId("editButton").setVisible(false);
            this.byId("saveButton").setVisible(true);
            this.byId("cancelButton").setVisible(true);
        },
 
        onSavePress: function () {
            this.byId("birthdate").setEditable(false);
            this.byId("address").setEditable(false);
            this.byId("PostalCode").setEditable(false);
            this.byId("extension").setEditable(false);
 
            // var iconTabBar = this.byId("iconTabBar");
            // var items = iconTabBar.getItems();
            // items.forEach(function (item) {
            //     var content = item.getContent();
            //     content.forEach(function (control) {
            //         if (control instanceof sap.m.Input) {
            //             control.setEditable(false);
            //         }
            //     });
            // });
 
            this.byId("editButton").setVisible(true);
            this.byId("saveButton").setVisible(false);
            this.byId("cancelButton").setVisible(false);
        },

        onCancelPress: function () {
            var iconTabBar = this.byId("iconTabBar");
            var items = iconTabBar.getItems();
            items.forEach(function (item) {
                var content = item.getContent();
                content.forEach(function (control) {
                    if (control instanceof sap.m.Input) {
                        control.setEditable(false);
                    }
                });
            });
 
            this.byId("editButton").setVisible(true);
            this.byId("saveButton").setVisible(false);
            this.byId("cancelButton").setVisible(false);
        },
 
        onSearch: function () {
            this.aFilters = [];
 
            var sOrderId = this.getControlValue("Order Id");
            var sCustomerId = this.getControlValue("Customer Id");
            var sShipVia = this.getControlValue("Ship via");
 
            if (sOrderId) {
                this.aFilters.push(new Filter("OrderID", FilterOperator.EQ, sOrderId));
            }
            if (sCustomerId) {
                this.aFilters.push(new Filter("CustomerID", FilterOperator.EQ, sCustomerId));
            }
            if (sShipVia) {
                this.aFilters.push(new Filter("ShipVia", FilterOperator.EQ, sShipVia));
            }
 
            this.applyFilters();
        },
 
        getControlValue: function (sKey) {
            var oFilterItem = this.oFilterBar.determineFilterItemByName(sKey);
            if (oFilterItem) {
                var sPropertyName = oFilterItem.getName();
                var oControl = this.oFilterBar.determineControlByName(sPropertyName);
                if (oControl) {
                    if (oControl instanceof sap.m.MultiComboBox) {
                        var selectedKeys = oControl.getSelectedKeys();
                        return selectedKeys.length > 0 ? selectedKeys[0] : null;
                    } else if (oControl instanceof sap.m.Input || oControl instanceof sap.m.ComboBox) {
                        var value = oControl.getValue();
                        return value;
                    }
                }
            }
            return null;
        },
 
        applyFilters: function () {
            var oBinding = this.oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(this.aFilters);
            }
        },
        

        onCustomerPopover: function(oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("OrderData");
            var oOrder = oContext.getProperty("OrderID");
        
            if (!this._oPopover) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.yash.assignment5.view.PopoverFiles.CustomerId",
                    controller: this
                }).then(function(oPopover) {
                    this._oPopover = oPopover;
                    this.getView().addDependent(this._oPopover);
        
                    var oModel = this.getView().getModel();
                    var sPath = "/Orders(" + oOrder + ")/Customer";
        
                    oModel.read(sPath, {
                        success: function(oData) {
                            var oCustomerModel = new sap.ui.model.json.JSONModel({
                                Customer: oData
                            });
                            this.getView().setModel(oCustomerModel, "CustomerModel");
                            this._oPopover.setModel(oCustomerModel, "CustomerModel");
        
                            var companyName = oData.CompanyName;
                            var address = oData.Address;
                            var city = oData.City;
        
                            this.byId("1").setText(companyName);
                            this.byId("2").setText(address);
                            this.byId("3").setText(city);
        
                            this._oPopover.openBy(oButton);
                        }.bind(this),
                        error: function(oError) {
                            console.log("Error in getting data",oError)
                        }
                    });
                }.bind(this));
            } else {
                var oModel = this.getView().getModel();
                var sPath = "/Orders(" + oOrder + ")/Customer";
        
                oModel.read(sPath, {
                    success: function(oData) {
                        var oCustomerModel = new sap.ui.model.json.JSONModel({
                            Customer: oData
                        });
                        this.getView().setModel(oCustomerModel, "CustomerModel");
                        this._oPopover.setModel(oCustomerModel, "CustomerModel");
        
                        var companyName = oData.CompanyName;
                        var address = oData.Address;
                        var city = oData.City;
        
                        this.byId("1").setText(companyName);
                        this.byId("2").setText(address);
                        this.byId("3").setText(city);
        
                        this._oPopover.openBy(oButton);
                    }.bind(this),
                    error: function(oError) {
                        console.log("Error in getting data",oError)
                    }
                });
            }
        },
       
        onClosePopover: function () {
            if (this._oPopover) {
                this._oPopover.close();
            }
        },

        onShipViaPopover: function(oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("OrderData");
            var oOrderID = oContext.getProperty("OrderID");
        
            if (!this._oPopover1) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.yash.assignment5.view.PopoverFiles.ShipVia",
                    controller: this
                }).then(function(oPopoverShip) {
                    this._oPopover1 = oPopoverShip;
                    this.getView().addDependent(this._oPopover1);
        
                    var oModel = this.getView().getModel();
                    var sPath = "/Orders(" + oOrderID + ")/Shipper";
        
                    oModel.read(sPath, {
                        success: function(oData) {
                            var oOrderModel = new sap.ui.model.json.JSONModel({
                                Shipper: oData
                            });
                            this.getView().setModel(oOrderModel, "OrderModel");
                            this._oPopover1.setModel(oOrderModel, "OrderModel");
        
                            var companyName1 = oData.CompanyName;
                            var shipperId = oData.ShipperID;
                            var contact = oData.Phone;
        
                            this.byId("companyName").setText(companyName1); 
                            this.byId("shipperId").setText(shipperId); 
                            this.byId("contact").setText(contact);  
        
                            this._oPopover1.openBy(oButton);
                        }.bind(this),
                        error: function(oError) {
                            console.error("Error loading Shipper data:", oError);
                        }
                    });
                }.bind(this));
            }  else {
                var oModel = this.getView().getModel();
                    var sPath = "/Orders(" + oOrderID + ")/Shipper";
        
                    oModel.read(sPath, {
                        success: function(oData) {
                            var oOrderModel = new sap.ui.model.json.JSONModel({
                                Shipper: oData
                            });
                            this.getView().setModel(oOrderModel, "OrderModel");
                            this._oPopover1.setModel(oOrderModel, "OrderModel");
        
                            var companyName1 = oData.CompanyName;
                            var shipperId = oData.ShipperID;
                            var contact = oData.Phone;
        
                            this.byId("companyName").setText(companyName1); 
                            this.byId("shipperId").setText(shipperId); 
                            this.byId("contact").setText(contact);  
        
                            this._oPopover1.openBy(oButton);
                        }.bind(this),
                        error: function(oError) {
                            console.error("Error loading Shipper data:", oError);
                        }
            })
        }
                
    },

        
        onClosePopover1: function () {
            if (this._oPopover1) {
                this._oPopover1.close();
            }
        },
            
        onSearchT: function () {
            this.aFilters = [];
            var sTerritoryId = this.getControlValueT("Territory Id");
            if (sTerritoryId) {
                this.aFilters.push(new Filter("TerritoryID", FilterOperator.EQ, sTerritoryId));
            }
            this.applyFiltersT();
        },

        getControlValueT: function (sKey) {
            var oFilterItem = this.getView().byId("filterBar").determineFilterItemByName(sKey);
            if (oFilterItem) {
                var sPropertyName = oFilterItem.getName();
                var oControl = this.getView().byId("filterBar").determineControlByName(sPropertyName);
                if (oControl) {
                    if (oControl instanceof sap.m.MultiComboBox) {
                        var selectedKeys = oControl.getSelectedKeys();
                        
                        return selectedKeys.length > 0 ? selectedKeys[0] : null;
                    } else if (oControl instanceof sap.m.Input || oControl instanceof sap.m.ComboBox) {
                        return oControl.getValue();
                    }
                }
            }
            return null;
        },

        applyFiltersT: function () {
            var oTable = this.getView().byId("tableTerritories");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(this.aFilters);
            }
        },
 
        onItemPress: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oBindingContext = oSelectedItem.getBindingContext("OrderData");
            var sOrderID = oBindingContext.getProperty("OrderID");
            this.oRouter1.navTo("RouteView3", {
                OrderID: sOrderID
            });
        },

        onItemPress1: function (oEvent) {
            var oSelectedItem = oEvent.getSource();
            var oBindingContext = oSelectedItem.getBindingContext("OrderData");
            if (oBindingContext) {
                var selectedOrderID = oBindingContext.getProperty("OrderID");
                this._oRouter.navTo("RouteView3", {
                    OrderID: selectedOrderID
                });
    } 
        },
        
        
        
               
    });
});
 
 
 
 


