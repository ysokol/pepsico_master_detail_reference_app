sap.ui.define([
    'sap/ui/base/Object',
    'com/pepsico/core/sap/ui/model/odata/v2/ODataModelExtensions',
    'com/pepsico/core/sap/ui/model/json/JSONModelExtensions',
    "com/pepsico/dev/reference/masterDetailTransactional/model/models"
], function (Object, ODataModelExtensions, JSONModelExtensions, models) {
    'use strict';
    return Object.extend('com.pepsico.dev.reference.masterDetailTransactional.model.TransportationItemService', {
        constructor: function ({
                                   oTransportationRepository = undefined,
                                   oTransportationViewModel = undefined,
                               } = {}) {
            Object.apply(this);
            this._oTransportationViewModel = oTransportationViewModel;
            this._oTranportationRepository = oTransportationRepository;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        init: function () {
        },
        clearCreateTransportationItemProps: function () {
            this._oTransportationViewModel.setProperty("/TransportationDetails/NewTransportationItemDetails",
                models.getTransportationViewModelInitialState().TransportationDetails.NewTransportationItemDetails);
        },
        initCreateTransportationItemProps: function () {
            this.clearCreateTransportationItemProps();
            this._oTransportationViewModel.setProperty("/NewTransportationItemDetails/ItemNum",
                this.getNextTransportationItemNum());
        },
        validateNewTransportationItem: function() {
            return true;
        },
        submitCreateTransportationItem: function() {
            return new Promise((fnResolve, fnReject) => {
                this._oTranportationRepository.createTransportationItem(
                    this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationHeader/__metadata/localODataPath"),
                    this._oTransportationViewModel.getProperty("/NewTransportationItemDetails")
                )
                    .then((oNewTransportationItem) => {
                        let aItems = this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems");
                        aItems.push(oNewTransportationItem);
                        this.clearCreateTransportationItemProps();
                        fnResolve(oNewTransportationItem);
                    });

            });
            //this._oTransportationViewModel.setProperty("/TransportationDetails/TransportationItems", aItems);
        },
        deleteTransportationItem: function(sPath) {
            return new Promise((fnResolve, fnReject) => {
                this._oTranportationRepository.deleteTransportationItem(sPath)
                    .then(() => {
                        let aItems = this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems");
                        aItems = aItems.filter(oItem => oItem.__metadata.localODataPath !== sPath);
                        this._oTransportationViewModel.setProperty("/TransportationDetails/TransportationItems", aItems);
                        fnResolve();
                    });
            });
        },
        getNextTransportationItemNum: function () {
            const aItems = this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems");
            return this.formatWithLeadingZero(
                parseInt(aItems.reduce((sMaxNum, oCurrentIrem) =>
                        (sMaxNum < oCurrentIrem.ItemNum) ? oCurrentIrem.ItemNum : sMaxNum,
                    "00000")) + 10,
                5);
        },
        formatWithLeadingZero: function (iNumber, iLeadingZeroCount) {
            return (1e15 + iNumber + "").slice(-iLeadingZeroCount);
        },

    });
});