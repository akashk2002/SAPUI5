sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("com.yash.assignment5.controller.View4", {
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("RouteView4").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var productId = oEvent.getParameter("arguments").ProductID;
            this.byId("productId").setText(productId);

            var sPath = "/Products(" + productId + ")";
            var oModel = this.getView().getModel();

            oModel.read(sPath, {
                success: function (oData) {
                    var oProductDetailsModel = new JSONModel(oData);
                    this.getView().setModel(oProductDetailsModel, "ProductDetailsData");
                    this.getView().bindElement({
                        path: "ProductDetailsData>/",
                        model: "ProductDetailsData"
                    });
                }.bind(this),
                error: function (oError) {
                    console.log("Error fetching product details:", oError);
                }
            });
        },

        onSupplierInfoPopover: function(oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("ProductDetailsData");
            var oProduct = oContext.getProperty("ProductID");
        
            if (!this._oPopover) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.yash.assignment5.view.PopoverFiles.SupplierInfo",
                    controller: this
                }).then(function(oPopover) {
                    this._oPopover = oPopover;
                    this.getView().addDependent(this._oPopover);
                    
                    var oModel = this.getView().getModel();
                    var sPath = "/Products(" + oProduct + ")/Supplier";
                    
                    oModel.read(sPath, {
                        success: function(oData) {
                            var oSuplierModel = new sap.ui.model.json.JSONModel({
                                Supplier: oData
                            });
                            this.getView().setModel(oSuplierModel, "SuplierModel");
                            this._oPopover.setModel(oSuplierModel, "SuplierModel");

                            console.log("SUPPLIER MODEL : ", oSuplierModel);

                            var companyName = oSuplierModel.getProperty("/Supplier/CompanyName");
                            var address = oSuplierModel.getProperty("/Supplier/Address");
                            var city = oSuplierModel.getProperty("/Supplier/City");
                            var Phone = oSuplierModel.getProperty("/Supplier/Phone");

                            this.byId("1").setText(companyName); 
                            this.byId("2").setText(address); 
                            this.byId("3").setText(city);  
                            this.byId("4").setText(Phone);  
                            
                            this._oPopover.openBy(oButton);
                        }.bind(this),
                        error: function(oError) {
                           
                        
                        }
                    });
                }.bind(this));
            } 
        },
        

   
    onClosePopover4: function () {
        if (this._oPopover) {
            this._oPopover.close();
        }
    },



    onCategoryInfoPopover: function(oEvent) {
        var oButton = oEvent.getSource();
        var oContext = oButton.getBindingContext("ProductDetailsData");
        var oProduct = oContext.getProperty("ProductID");
    
        if (!this.oCategoryPopover) {
            Fragment.load({
                id: this.getView().getId(),
                name: "com.yash.assignment5.view.PopoverFiles.CategoryInfo",
                controller: this
            }).then(function(oCategoryPopover) {
                this.oCategoryPopover = oCategoryPopover;
                this.getView().addDependent(this.oCategoryPopover);
                
                var oModel = this.getView().getModel();
                var sPath = "/Products(" + oProduct + ")/Category";
                
                oModel.read(sPath, {
                    success: function(oData) {
                        var oCategoryModel = new sap.ui.model.json.JSONModel(oData);
                        this.oCategoryPopover.setModel(oCategoryModel);
    
                        var categoryId = oData.CategoryID;
                        var categoryName = oData.CategoryName;
                        var description = oData.Description;
    
                        this.byId("categoryID").setText(categoryId); 
                        this.byId("categoryName").setText(categoryName); 
                        this.byId("description").setText(description);   
                        
                        this.oCategoryPopover.openBy(oButton);
                    }.bind(this),
                    error: function(oError) {
                       
                        console.error("Error fetching category data: ", oError);
                    }
                });
            }.bind(this));
        } else {
            var oModel = this.getView().getModel();
            var sPath = "/Products(" + oProduct + ")/Category";
            
            oModel.read(sPath, {
                success: function(oData) {
                    var oCategoryModel = new sap.ui.model.json.JSONModel(oData);
                    this.oCategoryPopover.setModel(oCategoryModel);
    
                    var categoryId = oData.CategoryID;
                    var categoryName = oData.CategoryName;
                    var description = oData.Description;
    
                    this.byId("categoryID").setText(categoryId); 
                    this.byId("categoryName").setText(categoryName); 
                    this.byId("description").setText(description);   
                    
                    this.oCategoryPopover.openBy(oButton);
                }.bind(this),
                error: function(oError) {
                    console.error("Error fetching category data: ", oError);
                }
            });
        }
    },
    
    onClosePopoverCategory: function () {
        if (this.oCategoryPopover) {
            this.oCategoryPopover.close();
        }
    }
    
    });
});
