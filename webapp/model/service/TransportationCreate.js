sap.ui.define([
    'sap/ui/base/Object',
    'com/pepsico/core/sap/ui/model/odata/v2/ODataModelExtensions',
    'com/pepsico/core/sap/ui/model/json/JSONModelExtensions',
    "com/pepsico/dev/reference/masterDetailTransactional/model/models"
], function (Object, ODataModelExtensions, JSONModelExtensions, models) {
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
    let TransportationCreate = Object.extend('com.pepsico.dev.reference.masterDetailTransactional.model.service.TransportationCreate', {
        constructor: function ({
                                   oTransportationRepository = undefined,
                                   oTransportationViewModel = undefined,
                                   oShippingLocationRepository = undefined,
                               } = {}) {
            Object.apply(this);
            this._oTranportationRepository = oTransportationRepository;
            this._oShippingLocationRepository = oShippingLocationRepository;
            this._oTransportationViewModel = oTransportationViewModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        init: function () {
            this.initCreateTransportationDialogReactions();
            //this.initTransportationDetailsReactions();
        },
        validateNewTransportation: function () {
            let bValidationResult = true;
            if (!this._oTransportationViewModel.getProperty("/NewTransportationDetails/ShipFrom", "")) {
                this._oMessageManager.addMessages(
                    new sap.ui.core.message.Message({
                        message: this._getI18nText("shipFromRequired"),
                        type: sap.ui.core.MessageType.Error,
                        target: "/NewTransportationDetails/ShipFrom",
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
                        target: "/NewTransportationDetails/Region",
                        processor: this._oTransportationViewModel
                    })
                );
                bValidationResult = false;
            }
            return bValidationResult;
        },
        clearCreateTransportationDetailsProps: function () {
            this._oTransportationViewModel.setProperty("/NewTransportationDetails",
                models.getTransportationViewModelInitialState().NewTransportationDetails);
        },
        initCreateTransportationDetailsProps: function () {
            this.clearCreateTransportationDetailsProps();
            /*return this.getNextTransportationNum()
                .then((sNextNum) =>
                    this._oTransportationViewModel.setProperty("/NewTransportationDetails/TransportationNum", sNextNum));*/
        },
        initCreateTransportationDialogReactions: function () {
            JSONModelExtensions.attachPropertyChanged({
                oJSONModel: this._oTransportationViewModel,
                sPath: "/NewTransportationDetails/Region",
                fnHandler: () => {
                    this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFrom", "");
                    this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFromDescription", "");
                    if (this._oTransportationViewModel.getProperty("/NewTransportationDetails/Region")) {
                        this._oShippingLocationRepository.findShippingLocationsByRegionAndType(
                            this._oTransportationViewModel.getProperty("/NewTransportationDetails/Region"), "PRODUCING")
                            .then((oLocations) => this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFromList", oLocations));
                    } else {
                        this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFromList", []);
                    }
                }
            });
        },
        formatWithLeadingZero: function (iNumber, iLeadingZeroCount) {
            return (1e15 + iNumber + "").slice(-iLeadingZeroCount);
        },
        getNextTransportationNum: function () {
            return new Promise((fnResolve, fnReject) => {
                this._oTranportationRepository.findTransportations()
                    .then((oTransportations) => fnResolve(this.formatWithLeadingZero(
                        parseInt(oTransportations.reduce((sMaxNum, oCurrentTransportation) =>
                                (sMaxNum < oCurrentTransportation.TransportationNum) ? oCurrentTransportation.TransportationNum : sMaxNum,
                            "0000")) + 10,
                        4)));
            });
        },
        createTransportation: function () {
            return new Promise((fnResolve, fnReject) => {
                this.getNextTransportationNum()
                    .then((sNextNum) => {
                        let oNewTransportation = this._oTransportationViewModel.getProperty("/NewTransportationDetails");
                        oNewTransportation.TransportationNum = sNextNum;
                        this._oTranportationRepository.createTransportationHeader(oNewTransportation)
                            .then(oData => fnResolve(oData));
                    });
            });
        },
        _getI18nText: function(sKey, aArgs) {
            return sap.ui.getCore().getLibraryResourceBundle("i18n").getText(sKey, aArgs);
        },
    });
    return TransportationCreate;
});