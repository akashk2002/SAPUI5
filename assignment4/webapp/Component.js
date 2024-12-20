sap.ui.define([
    "sap/ui/core/UIComponent",
    "assignment4/model/models",
    "sap/ui/model/json/JSONModel"
], (UIComponent, models, JSONModel) => {
    "use strict";

    return UIComponent.extend("assignment4.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // set the shipment ID model
            var oData = {
                shipmentId: ""
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel);

            // enable routing
            this.getRouter().initialize();
        }
    });
});