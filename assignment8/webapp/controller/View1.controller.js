sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (Controller, ODataModel, Filter, FilterOperator, Sorter) {
    "use strict";

    return Controller.extend("assignment8.controller.View1", {
        onInit: function () {
            var oModel = new ODataModel("/V2/Northwind/Northwind.svc/");
            this.getView().setModel(oModel);
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oList = this.byId("employeeList");
            var oBinding = oList.getBinding("items");
            var aFilters = [];

            if (sQuery) {
                aFilters.push(new Filter("FirstName", FilterOperator.Contains, sQuery));
                aFilters.push(new Filter("LastName", FilterOperator.Contains, sQuery));
            }

            oBinding.filter(aFilters);

            // Update the count after the binding is updated
            oBinding.attachChange(function() {
                var iCount = oBinding.getLength();
                this.byId("countLabel").setText("Count: " + iCount);
            }.bind(this));
        },

        onSort: function () {
            var oList = this.byId("employeeList");
            var oBinding = oList.getBinding("items");
            var oSorter = new Sorter("FirstName", false); // Sort by FirstName, ascending
            oBinding.sort(oSorter);
        }
    });
});