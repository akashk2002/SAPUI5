sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
],
function (Controller, JSONModel,MessageBox,  Fragment) {
    "use strict";

    return Controller.extend("com.yash.assignment7.controller.View1", {
        onInit: function () {
            var oModel = new JSONModel();
            oModel.loadData("/model/data.json")
            this.getView().setModel(oModel,"localHost");

            this._oView = this.getView();  //onSelectAllColumns

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
        },

        formatDate: function(date) {
            if (!date) {
                return "";
            }
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ style: "medium" });
            return oDateFormat.format(date);
        },

        onUserPress: function(oEvent) {
            var _oButton = oEvent.getSource();
            if (!this._oPopover1) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.yash.assignment7.view.FragmentsFolder.User", 
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

        async onAddPress() {
            this.oDialog ??= await this.loadFragment({
                name: "com.yash.assignment7.view.FragmentsFolder.AddEmployee"
            });
        
            // Clear input fields before opening the dialog
            this.byId("inputEmployeeID").setValue("");
            this.byId("inputFirstName").setValue("");
            this.byId("inputLastName").setValue("");
            this.byId("inputBirthDate").setValue("");
            this.byId("inputHireDate").setValue("");
            this.byId("inputAddress").setValue("");
            this.byId("inputCity").setValue("");
        
            this.oDialog.open();
        },
        
        onSaveEmployee: function() {
            // Retrieve values from input fields
            var sInputEmployeeID = this.byId("inputEmployeeID").getValue();
            var sInputFirstName = this.byId("inputFirstName").getValue();
            var sInputLastName = this.byId("inputLastName").getValue();
            var sInputBirthDate = this.byId("inputBirthDate").getValue();
            var sInputHireDate = this.byId("inputHireDate").getValue();
            var sInputAddress = this.byId("inputAddress").getValue();
            var sInputCity = this.byId("inputCity").getValue();
        
            // Validate required fields
            if (!sInputEmployeeID || !sInputFirstName || !sInputLastName || !sInputBirthDate || !sInputHireDate || !sInputAddress || !sInputCity) {
                MessageBox.error("All fields are required. Please fill in all fields.");
                return;
            }
        
            // Get reference to the model and existing data
            var oModel = this.getView().getModel("localHost");
            var oData = oModel.getProperty("/value");
        
            // Create a new employee object
            var oNewEmployee = {
                EmployeeID: sInputEmployeeID,
                FirstName: sInputFirstName,
                LastName: sInputLastName,
                BirthDate: sInputBirthDate,
                HireDate: sInputHireDate,
                Address: sInputAddress,
                City: sInputCity
            };
        
            this.oDialog.close();
        
            // Add the new employee to the existing data array
            oData.push(oNewEmployee);
        
            // Update the model with the modified data
            oModel.setProperty("/value", oData);
        
            // Update Total Records count
            this.byId("title").setText("Total Records: " + oData.length);
        
            // Clear input fields after adding to the table
            this.byId("inputEmployeeID").setValue("");
            this.byId("inputFirstName").setValue("");
            this.byId("inputLastName").setValue("");
            this.byId("inputBirthDate").setValue("");
            this.byId("inputHireDate").setValue("");
            this.byId("inputAddress").setValue("");
            this.byId("inputCity").setValue("");
        },
        
        onCloseEmployeeDialog: function() {
            this.oDialog.close()
        },

        onDeletePress: function () {
            // Get reference to the table and selected items
            var oTable = this.byId("table");
            var aSelectedItems = oTable.getSelectedItems();
        
            // Check if any items are selected
            if (aSelectedItems.length === 0) {
                // If no items are selected, show an error message and return
                MessageBox.error("Please select an employee to delete.");
                return;
            }
        
            // Show a confirmation dialog for deletion
            MessageBox.confirm("Are you sure you want to delete the selected employee(s)?", {
                onClose: function (oAction) {
                    // Handle user's action on the confirmation dialog
                    if (oAction === MessageBox.Action.OK) {
                        // User confirmed deletion, proceed with deletion logic
        
                        // Get reference to the local model
                        var oModel = this.getView().getModel("localHost");
                        var oData = oModel.getProperty("/value");
        
                        // Create an array to hold indices of items to delete
                        var aIndicesToDelete = [];
        
                        // Collect indices of selected items
                        aSelectedItems.forEach(function (oItem) {
                            // Get the binding context of the item
                            var oContext = oItem.getBindingContext("localHost");
                            if (oContext) {
                                // Get the path of the context and extract the index
                                var sPath = oContext.getPath();
                                var iIndex = parseInt(sPath.split("/").slice(-1)[0], 10);
                                aIndicesToDelete.push(iIndex);
                            }
                        });
        
                        // Sort indices in descending order to avoid issues with array shifting
                        aIndicesToDelete.sort(function(a, b) { return b - a; });
        
                        // Remove selected items from the data array
                        aIndicesToDelete.forEach(function (iIndex) {
                            oData.splice(iIndex, 1);
                        });
        
                        // Update the model with the modified data
                        oModel.setProperty("/value", oData);
        
                        // Clear selection in the table
                        oTable.removeSelections();
        
                        // Disable the delete button after deletion
                        this.byId("deleteButton").setEnabled(false);
                    }
                }.bind(this) 
            });
        },
        
        onTableSelectionChange: function (oEvent) {
            var oTable = oEvent.getSource();
            var aSelectedItems = oTable.getSelectedItems();

            
            this.byId("deleteButton").setEnabled(aSelectedItems.length > 0);
            this.byId("nextButton").setEnabled(true);
        },

        async onSettingsPress() {
            this._oDialog ??= await this.loadFragment({
                name: "com.yash.assignment7.view.FragmentsFolder.Settings"
            });
            this._oDialog.open()
        },

        onCancel: function () {
            this._oDialog.close();
        },

        
        onSelectAllColumns: function(oEvent) {
            var bSelected = oEvent.getParameter("selected");
            var oCheckBoxContainer = this._oView.byId("vBoxContainer"); 
            if (oCheckBoxContainer) {
                oCheckBoxContainer.getItems().forEach(function(oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem.getId() !== "selectAllCheckBox") {
                        oItem.setSelected(bSelected);
                    }
                });
            } else {
                console.error("VBox container not found.");
            }
        },

        onOK: function() {
            
            var oView = this.getView();
                var oTable = oView.byId("table");
           
            
                var aColumns = oTable.getColumns();
                var aCheckboxes = [
                    "EmployeeId", "name", "birthDate", "hireDate", "address", "city", "country", "title", "region"
                ];
           
                aCheckboxes.forEach(function (sCheckboxId, index) {
                    var bSelected = sap.ui.getCore().byId(oView.getId() + "--" + sCheckboxId).getSelected();
                    aColumns[index].setVisible(bSelected);
                });
           
                this._oDialog.close();
        },

        
        
		async onSortPress() {
            this._oDialog1 ??= await this.loadFragment({
                name: "com.yash.assignment7.view.FragmentsFolder.SortingFragment"
            });
            this._oDialog1.open()
        },

        onCancelSort: function () {
            this._oDialog1.close();
        },

        onOKSort: function() {
            var sortOrder = this.byId("sortOrder").getSelectedButton().getText();
            var sortBy = this.byId("sortBy").getSelectedButton().getId();
        
            // Determine the property to sort by based on the selected sortBy option
            var sortProperty;
            switch (sortBy) {
                case this.getView().createId("employeeId"):
                    sortProperty = "EmployeeID";
                    break;
                case this.getView().createId("firstName"):
                    sortProperty = "FirstName";
                    break;
                case this.getView().createId("lastName"):
                    sortProperty = "LastName";
                    break;
                case this.getView().createId("citySort"):
                    sortProperty = "City";
                    break;
                default:
                    sortProperty = "EmployeeID"; 
                    break;
            }
        
            // Sort the table model
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
            var aSorters = [];
        
            // Create sorter based on the selected sortOrder
            aSorters.push(new sap.ui.model.Sorter(sortProperty, sortOrder === "Descending"));
        
            // Apply the sorter to the binding
            oBinding.sort(aSorters);
        
            this._oDialog1.close();
        },
        
        onCancelSort: function() {
            this._oDialog1.close();
        },

        onNextToView2: function() {
            this._oRouter.navTo("RouteView2")
        }

    });
});







