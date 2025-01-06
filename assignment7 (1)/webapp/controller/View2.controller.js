sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("com.yash.assignment7.controller.View2", {
        onInit: function () {
            

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            this.fetchCategoriesCount();
        },

        fetchCategoriesCount: function () {
            var oModel = this.getOwnerComponent().getModel(); 
            oModel.read("/Categories/$count", {
                success: (data) => {
                    var categoriesCount = parseInt(data);
                    console.log("Categories count:", categoriesCount);
                    this.getView().byId("categoriesCount").setText(" Categories( " + categoriesCount + " )");
                },
                error: (error) => {
                    console.error("Error fetching categories count:", error);
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
                
                // Get version from manifest.json
                const oManifest = this.getOwnerComponent().getManifest();
                const sAppVersion = oManifest["sap.app"].applicationVersion.version;
        
                // Set version in the model of the fragment
                this._oDialogVer.setModel(new JSONModel({
                    version: sAppVersion
                }), "fragmentData");
        
                // Add fragment to the view's dependent aggregation
                this.getView().addDependent(this._oDialogVer);
            }
        
            
            this._oDialogVer.open();
        },

        onOKVersion: function() {
            this._oDialogVer.close();
        },
        onNextToView3: function () {
               
            if (this._selectedCategoryId) {
                this._oRouter.navTo("RouteView3", {
                    CategoryID: this._selectedCategoryId

                    
                });
            } else {
              
                sap.m.MessageToast.show("Please select a category first.");
            }
        },


        onListItemSelect: function (oEvent) {
            this.getView().byId("nextButton").setEnabled(true); 

            var sCategoryId = oEvent.getParameter("listItem").getBindingContext().getProperty("CategoryID");
            this._selectedCategoryId = sCategoryId;
        }

    

    });
});







