sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.yash.assignment5.controller.View1", {
        onInit: function() {
            this.oRouter = this.getOwnerComponent().getRouter();

            this.aFilters = [];
            this.oFilterBar = this.getView().byId("filterbar");
            this.oFilterBar.attachSearch(this.onSearch.bind(this));

            this.oTable = this.getView().byId("table");
            this.oTable.attachItemPress(this.onItemPress.bind(this));
        },
        


        onSearch: function () {
            this.aFilters = [];
       
            var sEmployeeId = this.getControlValue("EmployeeiD");
            sEmployeeId = sEmployeeId ? sEmployeeId.trim() : null; 
            var sCity = this.getControlValue("City");
            var sCountry = this.getControlValue("Country");
            var sRegion = this.getControlValue("Region");
       
            if (sEmployeeId) {
                this.sEmployeeId = String(sEmployeeId);
                this.aFilters.push(new Filter("EmployeeID", FilterOperator.Contains, sEmployeeId));
            }
            if (sCity) {
                this.aFilters.push(new Filter("City", FilterOperator.Contains, sCity));
            }
            if (sCountry) {
                this.aFilters.push(new Filter("Country", FilterOperator.Contains, sCountry));
            }
            if (sRegion) {
                this.aFilters.push(new Filter("Region", FilterOperator.Contains, sRegion));
            }
       
            this.applyFilters();
        },
       
        getControlValue: function (sKey) {
            var oFilterItem = this.oFilterBar.determineFilterItemByName(sKey);
            if (oFilterItem) {
                var sPropertyName = oFilterItem.getName();
                var oControl = this.oFilterBar.determineControlByName(sPropertyName);
                if (oControl) {
                    if (oControl instanceof sap.m.MultiComboBox) {
                        var selectedKeys = oControl.getSelectedKeys();
                        console.log("selectedKey: ", selectedKeys)
                        return selectedKeys.length > 0 ? selectedKeys[0] : null;
                    } else if (oControl instanceof sap.m.Input || oControl instanceof sap.m.ComboBox) {
                        var value = oControl.getValue();
                        return value;
                    }
                }
            }
            return null;
        },
       
        applyFilters: function () {
            var oBinding = this.oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(this.aFilters);
            }
        },

        onItemPress: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oBindingContext = oSelectedItem.getBindingContext();
            var sEmployeeID = oBindingContext.getProperty("EmployeeID");
        
            // Navigate to RouteView2 with the selected EmployeeID
            this.oRouter.navTo("RouteView2", {
                EmployeeID: sEmployeeID
            });
        },

     
        

        formatDate: function(date) {
            if (!date) {
                return "";
            }
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ style: "long" });
            return oDateFormat.format(date);
        }
    });
});
