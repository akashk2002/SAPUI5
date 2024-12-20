sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("assignment4.controller.View1", {
        onPickUpShipment: function () {
            this.getOwnerComponent().getRouter().navTo("OutboundShipment");
        },
        onDropOffDelivery: function () {
            this.getOwnerComponent().getRouter().navTo("TrackNumberEntry");
        }
    });
});