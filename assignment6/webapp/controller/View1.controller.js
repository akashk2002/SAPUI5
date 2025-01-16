sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
    "use strict";

    var TableController = Controller.extend("assignment6.controller.View1", {

        formatter: {
            // Example formatter function for price
            formatPrice: function(price) {
                return parseFloat(price).toFixed(2);
            },

            // Formatter function for availability state
            formatAvailabilityState: function(availability) {
                switch (availability) {
                    case "Available":
                        return "Success";
                    case "Out of Stock":
                        return "Error";
                    case "Discontinued":
                        return "Warning";
                    default:
                        return "None";
                }
            }
        },

        onInit: function () {
            // Create a JSON model
            var oModel = new JSONModel();

            // Load data from the JSON file
            oModel.loadData("/model/data.json");

            // Set the model to the view
            this.getView().setModel(oModel);
        }
    });

    return TableController;
});