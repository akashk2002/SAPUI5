sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("assignment7.controller.View1", {
        onInit: function() {
            var oModel = new JSONModel();
            oModel.loadData("/model/employee.json");
            this.getView().setModel(oModel);

            // Update employee count
            this._updateEmployeeCount();
        },

        _updateEmployeeCount: function() {
            var oModel = this.getView().getModel();
            var aEmployees = oModel.getProperty("/employees");
            var iCount = aEmployees ? aEmployees.length : 0;
            this.getView().byId("employeeCount").setText("Employee Count: " + iCount);
        },

        onOpenAddEmployeeDialog: function() {
            this.getView().byId("addEmployeeDialog").open();
        },

        onCloseAddEmployeeDialog: function() {
            this.getView().byId("addEmployeeDialog").close();
        },

        onAddEmployee: function() {
            var oView = this.getView();
            var oModel = oView.getModel();
            var aEmployees = oModel.getProperty("/employees");

            var oNewEmployee = {
                empId: oView.byId("empIdInput").getValue(),
                name: oView.byId("nameInput").getValue(),
                birthDate: oView.byId("birthDateInput").getDateValue().toISOString().split('T')[0],
                hireDate: oView.byId("hireDateInput").getDateValue().toISOString().split('T')[0],
                address: oView.byId("addressInput").getValue(),
                city: oView.byId("cityInput").getValue(),
                country: oView.byId("countryInput").getValue(),
                religion: oView.byId("religionInput").getValue()
            };

            aEmployees.push(oNewEmployee);
            oModel.setProperty("/employees", aEmployees);

            // Update employee count
            this._updateEmployeeCount();

            // Clear input fields
            oView.byId("empIdInput").setValue("");
            oView.byId("nameInput").setValue("");
            oView.byId("birthDateInput").setDateValue(null);
            oView.byId("hireDateInput").setDateValue(null);
            oView.byId("addressInput").setValue("");
            oView.byId("cityInput").setValue("");
            oView.byId("countryInput").setValue("");
            oView.byId("religionInput").setValue("");

            // Close the dialog
            this.onCloseAddEmployeeDialog();
        },

        onOpenDeleteEmployeeDialog: function() {
            this.getView().byId("deleteEmployeeDialog").open();
        },

        onCloseDeleteEmployeeDialog: function() {
            this.getView().byId("deleteEmployeeDialog").close();
        },

        onDeleteEmployee: function() {
            var oView = this.getView();
            var oModel = oView.getModel();
            var aEmployees = oModel.getProperty("/employees");
            var sEmpIdToDelete = oView.byId("deleteEmpIdInput").getValue();

            var aUpdatedEmployees = aEmployees.filter(function(oEmployee) {
                return oEmployee.empId !== sEmpIdToDelete;
            });

            oModel.setProperty("/employees", aUpdatedEmployees);

            // Update employee count
            this._updateEmployeeCount();

            // Clear input field
            oView.byId("deleteEmpIdInput").setValue("");

            // Close the dialog
            this.onCloseDeleteEmployeeDialog();
        }
    });
});