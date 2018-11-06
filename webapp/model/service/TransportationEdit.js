sap.ui.define([
    'sap/ui/base/Object',
    'com/pepsico/core/sap/ui/model/odata/v2/ODataModelExtensions',
    'com/pepsico/core/sap/ui/model/json/JSONModelExtensions',
    "com/pepsico/dev/reference/masterDetailTransactional/model/models"
], function (Object, ODataModelExtensions, JSONModelExtensions, models) {
    'use strict';
    /**
     * TransportationEdit class
     *
     * Class Implements logic for Edit Transportation scenario (validations, reactions)
     *
     * @class TransportationEdit
     * @param {object} oTransportationRepository
     * @param {object} oTransportationViewModel
     */
    let TransportationEdit = Object.extend('com.pepsico.dev.reference.masterDetailTransactional.model.service.TransportationEdit', {
        constructor: function ({
                                   oTransportationRepository = undefined,
                                   oTransportationViewModel = undefined,
	                               oTransportationItemService = undefined,
                                   oI18nModel = undefined,
                               } = {}) {
            Object.apply(this);
            this._oTranportationRepository = oTransportationRepository;
            this._oTransportationViewModel = oTransportationViewModel;
	        this._oTransportationItemService = oTransportationItemService;
            this._oI18nModel = oI18nModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        init: function () {
        },
        activateEditMode: function() {
            this._oTransportationViewModel.setProperty("/TransportationDetailsViewProps/IsEditMode", true);
        },
        hasPendingChanges: function() {
            this._oTranportationRepository.updateODataModel(
                this._oTransportationViewModel.getProperty("/TransportationDetails"));
            return this._oTranportationRepository.hasPendingChanges();
        },
        validateTransportation: function () {
            this._oMessageManager.removeAllMessages();
            let bValidationResult = true;
            if (this._oTransportationViewModel.getProperty("/TransportationDetails/ShipTo") &&
                this._oTransportationViewModel.getProperty("/TransportationDetails/ShipTo") ===
                this._oTransportationViewModel.getProperty("/TransportationDetails/ShipFrom")) {
                this._oMessageManager.addMessages(
                    new sap.ui.core.message.Message({
                        message: this._getI18nText("shipToShouldNotBeEqualShipFrom"),
                        type: sap.ui.core.MessageType.Error,
                        target: "/TransportationDetails/ShipToDetails/Description",
                        processor: this._oTransportationViewModel
                    })
                );
                bValidationResult = false;
            }
	        this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems")
		        .forEach((oItem, iIndex) => {
		        	if (!this._oTransportationItemService.validateTransportationItem(
					        "/TransportationDetails/TransportationItems/" + iIndex)) {
				        bValidationResult = false;
			        }
		        });
	        return bValidationResult;
        },
        submitChanges: function() {
	        this._oMessageManager.removeAllMessages();
            this._oTranportationRepository.updateODataModel(
                this._oTransportationViewModel.getProperty("/TransportationDetails"));
            return new Promise((fnResolve, fnReject) =>
                this._oTranportationRepository.submitChanges()
                    .then(() => {
                        this._oTransportationViewModel.setProperty("/TransportationDetailsViewProps/IsEditMode", false);
                        fnResolve();
                    })
            );
        },
        resetChanges: function() {
	        this._oMessageManager.removeAllMessages();
            this._oTranportationRepository.resetChanges();
            return new Promise((fnResolve, fnReject) =>
                this._oTranportationRepository.readTransportation(
                    this._oTransportationViewModel.getProperty("/TransportationDetails/__metadata/localODataPath"))
                    .then(oTransportationDetails => {
                        this._oTransportationViewModel.setProperty("/TransportationDetails", oTransportationDetails);
                        this._oTransportationViewModel.setProperty("/TransportationDetailsViewProps/IsEditMode", false);
                        fnResolve(oTransportationDetails);
                    })
            );
        },
        _getI18nText: function(sKey, aArgs) {
            return this._oI18nModel.getResourceBundle().getText(sKey, aArgs);
        },
    });
    return TransportationEdit;
});