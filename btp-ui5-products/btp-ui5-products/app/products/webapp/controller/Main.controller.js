sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, Fragment, Filter, FilterOperator, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("com.demo.products.controller.Main", {

    formatter: {
      stockState: function (iStock) {
        if (iStock === 0) { return "Error"; }
        if (iStock < 10) { return "Warning"; }
        return "Success";
      }
    },

    _t: function (sKey) {
      return this.getView().getModel("i18n").getResourceBundle().getText(sKey);
    },

    _selectedContext: function () {
      var oItem = this.byId("productTable").getSelectedItem();
      if (!oItem) { MessageToast.show(this._t("selectOne")); return null; }
      return oItem.getBindingContext();
    },

    _onError: function (oError) {
      MessageBox.error((oError && oError.message) || this._t("errorGeneric"));
    },

    onSearch: function (oEvent) {
      var sQuery = oEvent.getParameter("query");
      var aFilters = sQuery ? [new Filter({
        filters: [
          new Filter("name", FilterOperator.Contains, sQuery),
          new Filter("category", FilterOperator.Contains, sQuery)
        ],
        and: false
      })] : [];
      this.byId("productTable").getBinding("items").filter(aFilters);
    },

    onAdd: function () {
      var oView = this.getView();
      if (!this._pDialog) {
        this._pDialog = Fragment.load({
          id: oView.getId(),
          name: "com.demo.products.fragment.AddDialog",
          controller: this
        }).then(function (oDialog) { oView.addDependent(oDialog); return oDialog; });
      }
      this._pDialog.then(function (oDialog) { oDialog.open(); });
    },

    onCancel: function () {
      this._pDialog.then(function (oDialog) { oDialog.close(); });
    },

    onSave: function () {
      var that = this;
      var sName = this.byId("inName").getValue().trim();
      if (!sName) { this.byId("inName").setValueState("Error"); return; }
      this.byId("inName").setValueState("None");

      var oBinding = this.byId("productTable").getBinding("items");
      var oCtx = oBinding.create({
        name: sName,
        category: this.byId("inCategory").getValue(),
        description: this.byId("inDescription").getValue(),
        price: String(parseFloat(this.byId("inPrice").getValue()) || 0),
        currency: this.byId("inCurrency").getValue() || "EUR",
        stock: parseInt(this.byId("inStock").getValue(), 10) || 0
      });

      oCtx.created().then(function () {
        MessageToast.show(that._t("created"));
        that._pDialog.then(function (d) { d.close(); });
      }).catch(function (e) {
        if (!e.canceled) { that._onError(e); }
      });
    },

    onDelete: function () {
      var that = this, oCtx = this._selectedContext();
      if (!oCtx) { return; }
      MessageBox.confirm(this._t("confirmDelete"), {
        onClose: function (sAction) {
          if (sAction === MessageBox.Action.OK) {
            oCtx.delete().then(function () {
              MessageToast.show(that._t("deleted"));
            }).catch(function (e) { that._onError(e); });
          }
        }
      });
    },

    onRestock: function () {
      var that = this, oCtx = this._selectedContext();
      if (!oCtx) { return; }
      var oAction = this.getView().getModel().bindContext("ProductService.restock(...)", oCtx);
      oAction.setParameter("amount", 10);
      oAction.execute().then(function () {
        oCtx.refresh();
        MessageToast.show(that._t("restocked"));
      }).catch(function (e) { that._onError(e); });
    }
  });
});
