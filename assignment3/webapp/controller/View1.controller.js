  sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("assignment3.controller.View1", {
        onInit: function () {
            var oModel = new JSONModel("/model/Employees.json");
            this.getView().setModel(oModel);
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                var oFirstNameFilter = new Filter("FirstName", FilterOperator.Contains, sQuery);
                var oDesignationFilter = new Filter("Designation", FilterOperator.Contains, sQuery);
                aFilters.push(new Filter({
                    filters: [oFirstNameFilter, oDesignationFilter],
                    and: false
                }));
            }
            var oList = this.byId("employeeList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        },

        onListItemPress: function (oEvent) {
            this.getView().byId("details").setVisible(true);
            var oDetail = this.byId("details");
            var oPath = oEvent.getParameter("listItem").getBindingContextPath();
            oDetail.bindElement(oPath);
           

        }
    });
  });