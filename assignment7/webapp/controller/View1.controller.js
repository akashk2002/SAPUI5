sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/ResponsivePopover",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, ResponsivePopover, VBox, Text, Dialog, Button, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("assignment7.controller.View1", {
        onInit: function () {
            var oModel = new JSONModel({
                filterOptions: [
                    { key: "option1", text: "Option 1" },
                    { key: "option2", text: "Option 2" },
                    { key: "option3", text: "Option 3" },
                    { key: "option4", text: "Option 4" }
                ]
            });
            this.getView().setModel(oModel);

            // Fetch app version from manifest.json
            var oManifest = this.getOwnerComponent().getManifest();
            var sAppVersion = oManifest["sap.app"].applicationVersion.version;
            this.getView().setModel(new JSONModel({ appVersion: sAppVersion }), "appModel");
        },

        handleResponsivePopoverPress: function (oEvent) {
			var oButton = oEvent.getSource(),
				oView = this.getView();

			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "sap.m.sample.ResponsivePopover.view.Popover",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					oPopover.bindElement("/ProductCollection/0");
					return oPopover;
				});
			}
			this._pPopover.then(function(oPopover) {
				oPopover.openBy(oButton);
			});
		},
        onLanguagePress: function (oEvent) {
            if (!this._oLanguagePopover) {
                this._oLanguagePopover = new ResponsivePopover({
                    title: "Select Language",
                    contentWidth: "200px",
                    content: new VBox({
                        items: [
                            new Text({ text: "English" }),
                            new Text({ text: "Spanish" }),
                            new Text({ text: "French" }),
                            new Text({ text: "German" })
                        ]
                    })
                });
            }
            this._oLanguagePopover.openBy(oEvent.getSource());
        },

        onFilterPress: function (oEvent) {
            var sAppVersion = this.getView().getModel("appModel").getProperty("/appVersion");
            if (!this._oFilterDialog) {
                this._oFilterDialog = new Dialog({
                    title: "App Version",
                    content: new Text({ text: "App Version: " + sAppVersion }),
                    beginButton: new Button({
                        text: "Close",
                        press: function () {
                            this._oFilterDialog.close();
                        }.bind(this)
                    })
                });
            }
            this._oFilterDialog.open();
        }
    });
});