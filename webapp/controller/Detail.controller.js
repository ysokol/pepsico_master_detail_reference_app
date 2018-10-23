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

            /* =========================================================== */
            /* lifecycle methods                                           */
            /* =========================================================== */

            onInit: function () {
                // Model used to manipulate control states. The chosen values make sure,
                // detail page is busy indication immediately so there is no break in
                // between the busy indication for loading the view's meta data
                let oViewModel = new JSONModel({
                    busy: false,
                    delay: 0,
                    lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
                });

                this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

                this.setModel(oViewModel, "detailView");

                this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

                this.setDetailsFragmentBasedOnEditMode(false);
                JSONModelExtensions.attachPropertyChanged({
                    oJSONModel: this.getOwnerComponent().getModel("transportation"),
                    sPath: "/TransportationDetailsViewProps/IsEditMode",
                    fnHandler: () => this.setDetailsFragmentBasedOnEditMode(
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

            setDetailsFragmentBasedOnEditMode: function (bIsEditMode) {
                this.byId("transportationDetailsTab").removeAllContent();
                if (bIsEditMode) {
                    this.byId("transportationDetailsTab").insertContent(this.getFragment("TransportationDetailsEdit"));
                } else {
                    this.byId("transportationDetailsTab").insertContent(this.getFragment("TransportationDetailsDisplay"));
                }
            },

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */
            onTransportationItemCreateDialogOpen: function () {
                this.getOwnerComponent().oTransportationItemService.initCreateTransportationItemProps();
                this.getFragment("TransportationItemCreateDialog").open();
            },
            onTransportationItemCreateSubmit: function () {
                if (this.getOwnerComponent().oTransportationItemService.validateNewTransportationItem()) {
                    this.getOwnerComponent().oTransportationItemService.submitCreateTransportationItem();
                    this.getFragment("TransportationItemCreateDialog").close();
                } else {

                }
            },
            onSwitchEditMode: function () {
                this.getServiceFactory().getTransportationEdit().activateEditMode();
            },
            onSubmitChanges: function () {
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
            onTransportationItemDelete: function (oEvent) {
                let sLocalODataPath = this.getModel("transportation").getProperty(
                    oEvent.getSource().getParent().getBindingContextPath() + "/__metadata/localODataPath");
                MessageBox.confirm(this.getI18nText("deleteTransportationItem"), {
                    onClose: oAction => {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            this.getOwnerComponent().oTransportationItemService
                                .deleteTransportationItem(sLocalODataPath);
                        }
                    }
                });
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
                                this.getModel("transportation").getProperty("/TransportationDetails/TransportationHeader/__metadata/localODataPath"))
                                .then(() => {
                                    this.getServiceFactory().getTransportationService().clearCreateTransportationDetailsProps()
                                    this.onCloseDetailPress();
                                    sap.ui.core.BusyIndicator.hide();
                                });

                        }
                    }
                });
            },
            /**
             * Event handler when the share by E-Mail button has been clicked
             * @public
             */
            onSendEmailPress: function () {
                var oViewModel = this.getModel("detailView");

                sap.m.URLHelper.triggerEmail(
                    null,
                    oViewModel.getProperty("/shareSendEmailSubject"),
                    oViewModel.getProperty("/shareSendEmailMessage")
                );
            },

            /**
             * Event handler when the share in JAM button has been clicked
             * @public
             */
            onShareInJamPress: function () {
                var oViewModel = this.getModel("detailView"),
                    oShareDialog = sap.ui.getCore().createComponent({
                        name: "sap.collaboration.components.fiori.sharing.dialog",
                        settings: {
                            object: {
                                id: location.href,
                                share: oViewModel.getProperty("/shareOnJamTitle")
                            }
                        }
                    });

                oShareDialog.open();
            },

            /**
             * Updates the item count within the line item table's header
             * @param {object} oEvent an event containing the total number of items in the list
             * @private
             */
            onListUpdateFinished: function (oEvent) {
                var sTitle,
                    iTotalItems = oEvent.getParameter("total"),
                    oViewModel = this.getModel("detailView");

                // only update the counter if the length is final
                /*if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
                    if (iTotalItems) {
                        sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
                    } else {
                        //Display 'Line Items' instead of 'Line items (0)'
                        sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
                    }
                    oViewModel.setProperty("/lineItemListTitle", sTitle);
                }*/
            },

            /* =========================================================== */
            /* begin: internal methods                                     */
            /* =========================================================== */

            /**
             * Binds the view to the object path and expands the aggregated line items.
             * @function
             * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
             * @private
             */
            _onObjectMatched: function (oEvent) {
                var sObjectKey = oEvent.getParameter("arguments").sObjectKey;
                this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                this.getModel().metadataLoaded().then(function () {
                    this._bindView("/" + sObjectKey);
                }.bind(this));
            },

            /**
             * Binds the view to the object path. Makes sure that detail view displays
             * a busy indicator while data for the corresponding element binding is loaded.
             * @function
             * @param {string} sObjectPath path to the object to be bound to the view.
             * @private
             */
            _bindView: function (sObjectPath) {
                let oViewModel = this.getModel("detailView");
                oViewModel.setProperty("/busy", true);
                this.getTransportationService()
                    .readTransportationDetails(sObjectPath)
                    .then(() => oViewModel.setProperty("/busy", false));

                /*debugger;
                this.getView().bindElement({
                    path: sObjectPath,
                    mode: sap.ui.model.BindingMode.TwoWay,
                    suspended: true,
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function () {
                            //alert("dataRequested");
                            oViewModel.setProperty("/busy", true);
                        },
                        dataReceived: function () {
                            //alert("dataReceived");
                            oViewModel.setProperty("/busy", false);
                        }
                    }
                });*/
            },

            _onBindingChange: function () {
                var oView = this.getView(),
                    oElementBinding = oView.getElementBinding();

                // No data for the binding
                if (!oElementBinding.getBoundContext()) {
                    this.getRouter().getTargets().display("detailObjectNotFound");
                    // if object could not be found, the selection in the master list
                    // does not make sense anymore.
                    this.getOwnerComponent().oListSelector.clearMasterListSelection();
                    return;
                }

                var sPath = oElementBinding.getPath(),
                    oResourceBundle = this.getResourceBundle(),
                    oObject = oView.getModel().getObject(sPath),
                    sObjectId = oObject.TransportationNum,
                    sObjectName = oObject.Status,
                    oViewModel = this.getModel("detailView");

                this.getOwnerComponent().oListSelector.selectAListItem(sPath);

                oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
                oViewModel.setProperty("/shareOnJamTitle", sObjectName);
                oViewModel.setProperty("/shareSendEmailSubject",
                    oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
                oViewModel.setProperty("/shareSendEmailMessage",
                    oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
            },

            _onMetadataLoaded: function () {
                // Store original busy indicator delay for the detail view
                /*var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
                    oViewModel = this.getModel("detailView"),
                    oLineItemTable = this.byId("lineItemsList"),
                    iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

                // Make sure busy indicator is displayed immediately when
                // detail view is displayed for the first time
                oViewModel.setProperty("/delay", 0);
                oViewModel.setProperty("/lineItemTableDelay", 0);

                oLineItemTable.attachEventOnce("updateFinished", function () {
                    // Restore original busy indicator delay for line item table
                    oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
                });

                // Binding the view will set it to not busy - so the view is always busy if it is not bound
                oViewModel.setProperty("/busy", true);
                // Restore original busy indicator delay for the detail view
                oViewModel.setProperty("/delay", iOriginalViewBusyDelay);*/
            },

            /**
             * Set the full screen mode to false and navigate to master page
             */
            onCloseDetailPress: function () {
                this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
                // No item should be selected on master after detail page is closed
                this.getOwnerComponent().oListSelector.clearMasterListSelection();
                this.getRouter().navTo("master");
            },

            /**
             * Toggle between full and non full screen mode.
             */
            toggleFullScreen: function () {
                var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
                this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
                if (!bFullScreen) {
                    // store current layout and go full screen
                    this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
                    this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                } else {
                    // reset to previous layout
                    this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
                }
            },

            /**
             * Opens the Action Sheet popover
             * @param {sap.ui.base.Event} oEvent the press event of the share button
             */
            onSharePress: function (oEvent) {
                var oButton = oEvent.getSource();

                // create action sheet only once
                if (!this._actionSheet) {
                    this._actionSheet = sap.ui.xmlfragment(
                        "sap.ui.demo.masterdetail.view.ActionSheet",
                        this
                    );
                    this.getView().addDependent(this._actionSheet);
                    // forward compact/cozy style into dialog
                    jQuery.sap.syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), this._actionSheet);
                }
                this._actionSheet.openBy(oButton);
            }

        });

    }
);