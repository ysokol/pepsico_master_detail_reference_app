/*global location */
sap.ui.define([
        "com/pepsico/dev/reference/masterDetailTransactional/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "com/pepsico/dev/reference/masterDetailTransactional/model/formatter",
        "sap/m/MessageBox",
        'com/pepsico/core/sap/ui/model/json/JSONModelExtensions',
    ], function (BaseController, JSONModel, formatter, MessageBox, JSONModelExtensions) {
        "use strict";

        return BaseController.extend("com.pepsico.dev.reference.masterDetailTransactional.controller.Detail", {

            formatter: formatter,

            onInit: function () {
                this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
                this._setDetailsFragmentBasedOnEditMode(false);
                JSONModelExtensions.attachPropertyChanged({
                    oJSONModel: this.getOwnerComponent().getModel("transportation"),
                    sPath: "/TransportationDetailsViewProps/IsEditMode",
                    fnHandler: () => this._setDetailsFragmentBasedOnEditMode(
                        this.getModel("transportation").getProperty("/TransportationDetailsViewProps/IsEditMode"))
                });
                this.getView().bindElement({
                    path: "transportation>/TransportationDetails",
                    mode: sap.ui.model.BindingMode.TwoWay
                });
                this.getFragment("TransportationItemCreateDialog")
                    .bindElement({
                        path: "transportation>/NewTransportationItemDetails",
                        mode: sap.ui.model.BindingMode.TwoWay,
                    });
            },
	        /* =========================================================== */
	        /* Transportation Action Handlers                              */
	        /* =========================================================== */
            onSwitchEditMode: function () {
                this.getServiceFactory().getTransportationEdit().activateEditMode();
            },
            onSubmitChanges: function () {
                if (!this.getServiceFactory().getTransportationEdit().validateTransportation()) {
                    return;
                }
                this.getServiceFactory().getTransportationEdit().submitChanges();
            },
            onResetChanges: function () {
                if (this.getServiceFactory().getTransportationEdit().hasPendingChanges()) {
                    MessageBox.confirm(this.getI18nText("resetPendingChanges"), {
                        onClose: oAction => {
                            if (oAction === sap.m.MessageBox.Action.OK) {
                                this.getServiceFactory().getTransportationEdit().resetChanges();
                            }
                        }
                    });
                } else {
                    this.getServiceFactory().getTransportationEdit().resetChanges();
                }

            },
            onTransportationDelete: function (oEvent) {
                if (!this.getServiceFactory().getTransportationService().validateTransportationDeletion()) {
                    MessageBox.error(this.getI18nText("transportationCouldNotBeDeleted"));
                    return;
                }
                MessageBox.confirm(this.getI18nText("deleteTransportation"), {
                    onClose: oAction => {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            sap.ui.core.BusyIndicator.show(0);
                            this.getServiceFactory().getTransportationService().deleteTransportation(
                                this.getModel("transportation").getProperty("/TransportationDetails/__metadata/localODataPath"))
                                .then(() => {
                                    this.getServiceFactory().getTransportationService().resetTransportationDetailsProps()
                                    this.onCloseDetailPress();
                                    sap.ui.core.BusyIndicator.hide();
                                });

                        }
                    }
                });
            },
            onTransportationTravelMileageKmChanged: function() {
                this.getServiceFactory().getTransportationCalculateTotals().recalculatePrice();
            },
            /* =========================================================== */
            /* Transportation Items Action Handlers                        */
            /* =========================================================== */
            onTransportationItemCreateDialogOpen: function () {
                this.getServiceFactory().getTransportationItemService().initCreateTransportationItemProps();
                this.getFragment("TransportationItemCreateDialog").open();
            },
            onTransportationItemCreateDialogMaterialChanged: function() {
                this.getServiceFactory().getTransportationItemService().onMaterialChanged("/NewTransportationItemDetails/");
            },
            onTransportationItemCreateSubmit: function () {
                if (this.getServiceFactory().getTransportationItemService().validateNewTransportationItem()) {
                    this.getServiceFactory().getTransportationItemService().createTransportationItem();
                    this.getFragment("TransportationItemCreateDialog").close();
                }
            },
            onTransportationItemCreateCancel: function () {
                this.getServiceFactory().getTransportationItemService().clearCreateTransportationItemProps();
                this.getFragment("TransportationItemCreateDialog").close();
            },
            onTransportationItemEditDialogOpen: function (oEvent) {
                this.getFragment("TransportationItemEditDialog").bindElement({
                    path: oEvent.getSource().getBindingContextPath(),
                    model: "transportation"
                });
                this.getFragment("TransportationItemEditDialog").open();
            },
            onTransportationItemEditDialogMaterialChanged: function() {
                this.getServiceFactory().getTransportationItemService().onMaterialChanged(
                    this.getFragment("TransportationItemEditDialog").getBindingContext("transportation").getPath() + "/"
                );
            },
            onTransportationItemEditSubmit: function (oEvent) {
	            const sLocalODataPath = oEvent.getSource().getParent().getBindingContext("transportation");
                if (!this.getServiceFactory().getTransportationItemService().validateTransportationItem(sLocalODataPath)) {
                    return;
                }
                this.getFragment("TransportationItemEditDialog").close();
            },
            onTransportationItemEditCancel: function (oEvent) {
                this.getServiceFactory().getTransportationItemService().resetTransportationItemChanges(
                    this.getFragment("TransportationItemEditDialog").getBindingContext("transportation").getPath()
                );
                this.getFragment("TransportationItemEditDialog").close();
            },
            onTransportationItemDelete: function (oEvent) {
                const sLocalODataPath = this.getModel("transportation").getProperty(
                    oEvent.getSource().getParent().getBindingContextPath() + "/__metadata/localODataPath");
                MessageBox.confirm(this.getI18nText("deleteTransportationItem"), {
                    onClose: oAction => {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            this.getServiceFactory().getTransportationItemService()
                                .deleteTransportationItem(sLocalODataPath);
                        }
                    }
                });
            },
            /* =========================================================== */
            /* begin: other controller action handlers                     */
            /* =========================================================== */
            /**
             * Binds the view to the object path and expands the aggregated line items.
             * @function
             * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
             * @private
             */
            _onObjectMatched: function (oEvent) {
                let sObjectKey = oEvent.getParameter("arguments").sObjectKey;
                this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                this._loadTransportationDetails("/" + sObjectKey);
            },
            _loadTransportationDetails: function (sObjectPath) {
                this.getModel("transportation").setProperty("TransportationDetailsViewProps/BusyIndicator", true);
                this.getServiceFactory().getTransportationService()
                    .readTransportationDetails(sObjectPath)
                    .then(() => {
                        this.getOwnerComponent().oListSelector.selectAListItem(sObjectPath);
                        this.getModel("transportation")
                            .setProperty("TransportationDetailsViewProps/BusyIndicator", false);
                    })
                    .catch(() => {
                        this.getRouter().getTargets().display("detailObjectNotFound");
                        this.getOwnerComponent().oListSelector.clearMasterListSelection();
                        this.getModel("transportation")
                            .setProperty("TransportationDetailsViewProps/BusyIndicator", false);
                    });
            },
            _setDetailsFragmentBasedOnEditMode: function (bIsEditMode) {
                this.byId("transportationDetailsTab").removeAllContent();
                if (bIsEditMode) {
                    this.byId("transportationDetailsTab").insertContent(this.getFragment("TransportationDetailsEdit"));
                } else {
                    this.byId("transportationDetailsTab").insertContent(this.getFragment("TransportationDetailsDisplay"));
                }
            },
	        onCloseDetailPress: function () {
		        this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
		        this.getOwnerComponent().oListSelector.clearMasterListSelection();
		        this.getRouter().navTo("master");
	        },
	        onToggleFullScreen: function () {
		        let bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
		        this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
		        if (!bFullScreen) {
			        this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
			        this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
		        } else {
			        this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
		        }
	        },
        });

    }
);