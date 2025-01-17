sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
], function (Controller, JSONModel, Filter, FilterOperator, Sorter, MessageBox) {
    "use strict";
   
    return Controller.extend("assignment6.controller.View1", {
       
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            var dataModel = new JSONModel("/model/data.json");
            this.getView().setModel(dataModel, "products"); // Ensure the model name matches
            this.getView().setModel(dataModel, "value");
        
            var valueModel = this.getView().getModel("value");
            valueModel.setProperty("/shoppingCartItems", []);
            valueModel.setProperty("/savingForLaterItems", []);
        },
 
        formatAvailabilityState: function (sAvailability) {
            var states = {
                "Available": "Success",
                "Discontinued": "Error",
                "Out of Stock": "Warning"
            };
            return states[sAvailability] || "None";
        },
 
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTableSearchState = sQuery ? [new Filter("name", FilterOperator.Contains, sQuery)] : [];
            this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");
        },
 
        onSort: function () {
            this._bDescendingSort = !this._bDescendingSort;
            var oBinding = this.getView().byId("productsTable").getBinding("items");
            oBinding.sort(new Sorter("name", this._bDescendingSort));
        },
 
        onListItemPress: function (event) {
            var oFlexibleColumnLayout = this.byId("flexibleColumnLayout");
            oFlexibleColumnLayout.setLayout("TwoColumnsMidExpanded");
 
            var selectedItemName = event.getParameter("listItem").getBindingContext("value").getProperty("name");
            var dataModel = this.getView().getModel("products");
            var selectedProduct = dataModel.getProperty("/Products").find(function (product) {
                return product.name === selectedItemName;
            });
 
            if (selectedProduct) {
                var oView = this.getView();
                oView.byId("productImage").setSrc(selectedProduct.photo);
                oView.byId("nameAttribute").setTitle(" Prodct name:" + selectedProduct.name);
                oView.byId("priceAttribute").setText(" " + selectedProduct.price);
                oView.byId("currencyAttribute").setText("Currency " + selectedProduct.currency);
                oView.byId("availabilityAttribute").setText(" " + selectedProduct.availability);
                oView.byId("supplierAttribute").setText("Supplier: " + selectedProduct.supplier);
                oView.byId("descriptionAttribute").setText("Description: " + selectedProduct.description);
                oView.byId("weightAttribute").setText("Weight: " + selectedProduct.weight);
                oView.byId("measurementsAttribute").setText("Measurements: " + selectedProduct.measurements);
            }
        },
 
        onImagePress: function (event) {
            var oDialog = new sap.m.Dialog({
                content: new sap.m.Image({ src: event.getSource().getSrc(), width: "80%" }),
                beginButton: new sap.m.Button({ text: "Close", press: function () { oDialog.close(); } }),
                afterClose: function () { oDialog.destroy(); }
            });
            oDialog.open();
        },
 
        onShowCardPress: function () {
            var valueModel = this.getView().getModel("value");
            valueModel.setProperty("/shoppingCartItems", []);
            valueModel.setProperty("/savingForLaterItems", []);
            this.getView().byId("editToolbar").setVisible(true);
            this.byId("flexibleColumnLayout").setLayout("ThreeColumnsMidExpanded");
        },
 
        onEditPress: function () {
            this.byId("shoppingCartList").setMode("Delete");
            this.getView().byId("editToolbar").setVisible(false);
        },
 
        onDeletePress: function (oEvent) {
            var oListItem = oEvent.getParameter("listItem");
            var oList = this.byId("shoppingCartList");
            var aItems = this.getView().getModel("value").getProperty("/shoppingCartItems");
            var iIndex = oList.indexOfItem(oListItem);
 
            if (iIndex !== -1) {
                aItems.splice(iIndex, 1);
                this.getView().getModel("value").setProperty("/shoppingCartItems", aItems);
                oList.removeItem(oListItem);
                this.updateTotalPrice();
            }
        },
 
        onAddToCartPress: function () {
            var oView = this.getView();
            var availability = oView.byId("availabilityAttribute").getText().trim();
 
            if (availability === "Discontinued") {
                MessageBox.error("This product has been discontinued and cannot be ordered anymore.");
                return;
            }
 
            var product = {
                name: oView.byId("nameAttribute").getTitle().trim(),
                price: parseFloat(oView.byId("priceAttribute").getText().trim()),
                currency: oView.byId("currencyAttribute").getText().trim(),
                availability: availability
            };
 
            var handleAddToCart = function () {
                var shoppingCartList = this.byId("shoppingCartList");
                var savingForLaterList = this.byId("savingForLaterList");
                var savingForLaterItems = savingForLaterList.getItems();
 
                var itemToRemove = savingForLaterItems.find(function (item) {
                    return item.getContent()[0].getItems()[0].getText() === product.name;
                });
 
                if (itemToRemove) {
                    savingForLaterList.removeItem(itemToRemove);
                }
 
                var newListItem = new sap.m.CustomListItem({
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.Title({ text: product.name, level: "H3" }),
                                new sap.m.VBox({
                                    items: [
                                        new sap.m.Text({ text: "Price: " + product.price }),
                                        new sap.m.Text({ text: "Currency: " + product.currency }),
                                        new sap.m.Text({ text: "Availability: " + product.availability })
                                    ]
                                })
                            ]
                        }),
                        new sap.m.Link({ text: "Save for Later", press: this.onSaveForLaterPress.bind(this, product) })
                    ]
                });
 
                shoppingCartList.addItem(newListItem);
                this.updateTotalPrice(product.price);
                this.byId("flexibleColumnLayout").setLayout("ThreeColumnsMidExpanded");
            }.bind(this);
 
            if (availability === "Out of Stock") {
                MessageBox.confirm(
                    "This product is out of stock. Do you still want to add it to the cart?", {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.YES) {
                                handleAddToCart();
                            }
                        }
                    }
                );
            } else {
                handleAddToCart();
            }
        },
 
        updateTotalPrice: function () {
            var totalPrice = this.byId("shoppingCartList").getItems().reduce(function (sum, item) {
                var price = parseFloat(item.getContent()[0].getItems()[1].getItems()[0].getText().match(/\d+(?:\.\d+)?/));
                return sum + price;
            }, 0);
 
            this.byId("totalPriceText").setText("Total Price: " + totalPrice.toFixed(2) + " EUR");
        },
 
        onSaveForLaterPress: function (product) {
            var shoppingCartList = this.byId("shoppingCartList");
            var shoppingCartItems = shoppingCartList.getItems();
 
            var itemToRemove = shoppingCartItems.find(function (item) {
                return item.getContent()[0].getItems()[0].getText() === product.name;
            });
 
            if (itemToRemove) {
                shoppingCartList.removeItem(itemToRemove);
            }
 
            this.updateTotalPrice(0);
 
            var newListItem = new sap.m.CustomListItem({
                content: [
                    new sap.m.VBox({
                        items: [
                            new sap.m.Title({ text: product.name, level: "H3" }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({ text: "Price: " + product.price + " " + product.currency }),
                                    new sap.m.Text({ text: "Availability: " + product.availability })
                                ]
                            })
                        ]
                    }),
                    new sap.m.Link({ text: "Add to shopping cart", press: this.onAddToCartPress.bind(this, product) })
                ]
            });
 
            this.byId("savingForLaterList").addItem(newListItem);
        },
 
        onProceedPress: function () {
            var shoppingCartItems = this.byId("shoppingCartList").getItems().map(function (item) {
                var itemContent = item.getContent()[0].getItems();
                return {
                    name: itemContent[0].getText(),
                    price: parseFloat(itemContent[1].getItems()[0].getText().split(" ")[1]),
                    currency: itemContent[1].getItems()[0].getText().split(" ")[2],
                    availability: itemContent[1].getItems()[1].getText().split(": ")[1]
                };
            });

            if (shoppingCartItems.length > 0) {
                this.oRouter.navTo("RouteView2", { selectedItems: JSON.stringify(shoppingCartItems) });
            } else {
                MessageBox.error("No items in the shopping cart.");
            }
        }
    });
});