/*global history */
sap.ui.define([
	"com/pepsico/dev/reference/masterDetailTransactional/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"com/pepsico/dev/reference/masterDetailTransactional/model/formatter",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
    "sap/m/MessageBox"
], function(BaseController, JSONModel, History, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("com.pepsico.dev.reference.masterDetailTransactional.controller.Master", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function() {
			this.getView().addEventDelegate({
				onBeforeFirstShow: function() {
					this.getOwnerComponent().oListSelector.setBoundMasterList(this.byId("list"));
				}.bind(this)
			});

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);

            this.getFragment("TransportationCreateDialog").bindElement({
				path: "transportation>/NewTransportationDetails",
                mode: sap.ui.model.BindingMode.TwoWay,
			});
		},
		onNewTransportationDialogOpen: function() {
		    this.getServiceFactory().getTransportationCreate()
				.initCreateTransportationDetailsProps();
		    this.getFragment("TransportationCreateDialog").open();
		},
		onNewTransportationRegionChanged: function() {
			this.getServiceFactory().getTransportationCreate().onRegionChanged();
		},
		onNewTransportationSubmit: function() {
		    this.removeAllMessages();
		    if (!this.getServiceFactory().getTransportationCreate().validateNewTransportation()) {
			    return;
            }
            sap.ui.core.BusyIndicator.show(0);
            this.getServiceFactory().getTransportationCreate().createTransportation()
                .then((oData) => {
                    this.getFragment("TransportationCreateDialog").close();
                    sap.ui.core.BusyIndicator.hide();
                    this._navToDetail(oData.__metadata.localODataPath.substring(1));
                });
		},
		onNewTransportationCancel: function() {
            this.getServiceFactory().getTransportationCreate().clearCreateTransportationDetailsProps();
		    this.getFragment("TransportationCreateDialog").close();
		},
		onRefresh: function() {
			this._oList.getBinding("items").refresh();
		},
		onSelectionChange: function(oEvent) {
			const oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				this._navToDetail((oEvent.getParameter("listItem") || oEvent.getSource()).getBindingContext().getPath().substring(1));
			}
		},
		onBypassed: function() {
			this._oList.removeSelections(true);
		},
		_onMasterMatched: function() {
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},
        _navToDetail: function(sTransportationKey) {
		    const bReplace = !Device.system.phone;
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            this.getRouter().navTo("object", {
                sObjectKey: sTransportationKey
            }, bReplace);
        },

	});

});