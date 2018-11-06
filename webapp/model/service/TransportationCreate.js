sap.ui.define([
    "sap/ui/base/Object",
    "com/pepsico/core/sap/ui/model/json/JSONModelExtensions",
    "com/pepsico/dev/reference/masterDetailTransactional/model/models"
], function (Object, JSONModelExtensions, models) {
    'use strict';
    /**
     * TransportationCreate class
     *
     * Implements logic for Create New Transportation Draft dialog (validations, reactive fields dependencies etc.)
     *
     * @class TransportationCreate
     * @param {object} oTransportationRepository
     * @param {object} oTransportationViewModel
     * @param {object} oShippingLocationRepository
     */
    let TransportationCreate = Object.extend("com.pepsico.dev.reference.masterDetailTransactional.model.service.TransportationCreate", {
        constructor: function ({
                                   oTransportationRepository = undefined,
                                   oTransportationViewModel = undefined,
                                   oShippingLocationRepository = undefined,
                                   oI18nModel = undefined,
                               } = {}) {
            Object.apply(this);
            this._oTranportationRepository = oTransportationRepository;
            this._oTransportationViewModel = oTransportationViewModel;
            this._oI18nModel = oI18nModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        init: function () {
        },
	    onRegionChanged: function() {
		    this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFrom", "");
		    this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFromDetails/Description", "");
	    },
        validateNewTransportation: function () {
            this._oMessageManager.removeAllMessages();
            let bValidationResult = true;
            if (!this._oTransportationViewModel.getProperty("/NewTransportationDetails/ShipFrom", "")) {
                this._oMessageManager.addMessages(
                    new sap.ui.core.message.Message({
                        message: this._getI18nText("shipFromRequired"),
                        type: sap.ui.core.MessageType.Error,
                        target: "/NewTransportationDetails/ShipFromDetails/Description",
                        processor: this._oTransportationViewModel
                    })
                );
                bValidationResult = false;
            }
            if (!this._oTransportationViewModel.getProperty("/NewTransportationDetails/Region", "")) {
                this._oMessageManager.addMessages(
                    new sap.ui.core.message.Message({
                        message: this._getI18nText("regionRequired"),
                        type: sap.ui.core.MessageType.Error,
                        target: "/NewTransportationDetails/RegionDetails/Description",
                        processor: this._oTransportationViewModel
                    })
                );
                bValidationResult = false;
            }
            return bValidationResult;
        },
        clearCreateTransportationDetailsProps: function () {
	        this._oMessageManager.removeAllMessages();
            this._oTransportationViewModel.setProperty("/NewTransportationDetails",
                models.createTransportationDetails());
        },
        initCreateTransportationDetailsProps: function () {
            this.clearCreateTransportationDetailsProps();
        },
        createTransportation: function () {
            debugger;
            return new Promise((fnResolve, fnReject) => {
                this._getNextTransportationNum()
                    .then((sNextNum) => {
                        let oNewTransportation = this._oTransportationViewModel.getProperty("/NewTransportationDetails");
                        oNewTransportation.TransportationNum = sNextNum;
                        this._oTranportationRepository.createTransportationHeader(oNewTransportation)
                            .then(oData => fnResolve(oData));
                    });
            });
        },
	    _formatWithLeadingZero: function (iNumber, iLeadingZeroCount) {
		    return (1e15 + iNumber + "").slice(-iLeadingZeroCount);
	    },
	    _getNextTransportationNum: function () {
		    return new Promise((fnResolve, fnReject) => {
			    this._oTranportationRepository.findTransportations()
				    .then((oTransportations) => fnResolve(this._formatWithLeadingZero(
					    parseInt(oTransportations.reduce((sMaxNum, oCurrentTransportation) =>
							    (sMaxNum < oCurrentTransportation.TransportationNum) ? oCurrentTransportation.TransportationNum : sMaxNum,
						    "0000")) + 10,
					    4)));
		    });
	    },
        _getI18nText: function(sKey, aArgs) {
            return this._oI18nModel.getResourceBundle().getText(sKey, aArgs);
        },
    });
    return TransportationCreate;
});