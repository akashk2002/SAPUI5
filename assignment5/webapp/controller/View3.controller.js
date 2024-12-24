
sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller,Filter, FilterOperator) {
        "use strict";
 
        return Controller.extend("com.yash.assignment5.controller.View3", {
            onInit: function () {
                
            var _oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteView3").attachPatternMatched(this._onRouterMatched, this);
                
            this.oRouter = oRouter;

            this.aFilters = [];
        
            this.oFilterBar = this.getView().byId("filterbar");
            this.oTable = this.getView().byId("productTable");

            

            // Register event handlers
            this.oFilterBar.attachSearch(this.onSearch.bind(this));
            this.oTable.attachItemPress(this.onItemPress.bind(this));
            
             },
             _onRouterMatched: function(oEvent) {
                var argument = oEvent.getParameter("arguments").OrderID;
                console.log("orderid: ", argument)
                this.byId("orderId").setText(argument);
                var oModel = this.getView().getModel(); 
                var sPath1 = "/Orders(" + argument + ")/Order_Details";
                console.log("ARG : ", argument);
                oModel.read(sPath1, {
                    success: function(oData) {
                        var oProductModel = new sap.ui.model.json.JSONModel({
                            Order_Details: oData.results
                        });
                        console.log("OPRODUCTMODEL : ", oProductModel);
                        this.getView().setModel(oProductModel, "ProductData");
                    }.bind(this),
                    error: function(oError) {
                        console.log("Error in getting data",oError)
                    }
                        
                    });
               
            },

            onBackToView2: function () {
                var _oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                _oRouter.navTo("RouteView2");
            },
     
            onSearch: function () {
                this.aFilters = [];
                var sProductId = this.getControlValue("Product Id");
                if (sProductId) {
                    this.aFilters.push(new Filter("ProductID", FilterOperator.EQ, sProductId));
                }
                this.applyFilters();
            },
    
            getControlValue: function (sKey) {
                var oFilterItem = this.getView().byId("filterbar").determineFilterItemByName(sKey);
                if (oFilterItem) {
                    var sPropertyName = oFilterItem.getName();
                    var oControl = this.getView().byId("filterbar").determineControlByName(sPropertyName);
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
    
            applyFilters: function () {
                var oTable = this.getView().byId("productTable");
                var oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.filter(this.aFilters);
                }
            },
           
            onItemPress: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oBindingContext = oSelectedItem.getBindingContext("ProductData");
                var sProductID = oBindingContext.getProperty("ProductID");
                if (this.oRouter) {
                    this.oRouter.navTo("RouteView4", {
                        ProductID: sProductID
                    });
                }
                
            },
            
         
           
        });
    });
 
 