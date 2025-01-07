sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("com.yash.assignment7.controller.View3", {
        onInit: function () {
            

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteView3").attachPatternMatched(this._onRouteMatched, this);
          
        },

        _onRouteMatched: function(oEvent) {
            var argument = oEvent.getParameter("arguments").CategoryID;
            var oModel = this.getView().getModel();
            console.log("catId: ", argument)
            
            var sPath = "/Categories(" + argument + ")/Products";
            oModel.read(sPath, {
                success: function(oData) {
                    var oProductModel = new sap.ui.model.json.JSONModel({
                        Products: oData.results
                    });
                    console.log("OMODEL : ", oProductModel);
                    this.getView().setModel(oProductModel, "ProductData");
                }.bind(this),
                error: function(oError) {
                    console.log("Error in getting data",oError)
                }
                    
        });
           
        },

        


        onUserPress: function(oEvent) {
            var _oButton = oEvent.getSource();
            if (!this._oPopover1) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.yash.assignment7.view.FragmentsFolder.User", // Adjust the fragment path and name
                    controller: this
                }).then(function(oPopover1) {
                    this._oPopover1 = oPopover1;
                    this.getView().addDependent(this._oPopover1);
                    this._oPopover1.openBy(_oButton);
                }.bind(this));
            } else {
                this._oPopover1.openBy(_oButton);
            }
        },

        onLanguagePress: function(oEvent) {
            var oButton = oEvent.getSource();

    
            if (!this._oPopover) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.yash.assignment7.view.FragmentsFolder.LanguagePopover",
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

        async onVersionPress() {
            if (!this._oDialogVer) {

                this._oDialogVer = await this.loadFragment({
                    name: "com.yash.assignment7.view.FragmentsFolder.Version"
                });
                
                
                const oManifest = this.getOwnerComponent().getManifest();
                const sAppVersion = oManifest["sap.app"].applicationVersion.version;
        
                
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

        
        onProductDetails: function(oEvent) {
            var oButton = oEvent.getSource();
            var oProduct = oButton.getBindingContext("ProductData").getObject(); // Get the product object from the binding context
        
            if (!this._oPopoverProductDetails) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.yash.assignment7.view.FragmentsFolder.ProductDetails",
                    controller: this 
                }).then(function(oPopover) {
                    this._oPopoverProductDetails = oPopover;
                    this.getView().addDependent(this._oPopoverProductDetails);
                    this._setPopoverProductDetailsData(oProduct); 
                    this._oPopoverProductDetails.openBy(oButton);
                }.bind(this));
            } else {
                this._setPopoverProductDetailsData(oProduct); 
                this._oPopoverProductDetails.openBy(oButton);
            }
        },
        
        _setPopoverProductDetailsData: function(oProduct) {
            var oPopover = this._oPopoverProductDetails;
            var oView = this.getView();
            oPopover.setModel(new JSONModel(oProduct), "productDetails");
        }
        

        
    });
});







