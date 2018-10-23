sap.ui.define([
    'sap/ui/base/Object',
    'com/pepsico/core/sap/ui/model/odata/v2/ODataModelExtensions',
    'com/pepsico/core/sap/ui/model/json/JSONModelExtensions',
    "com/pepsico/dev/reference/masterDetailTransactional/model/models"
], function (Object, ODataModelExtensions, JSONModelExtensions, models) {
    'use strict';
    /**
     * TransportationCalculateTotals class
     *
     * Implements reactive logic for recalculation of total transportation weight and volume,
     * based on TransportationItems[] changes.
     *
     * @class TransportationCalculateTotals
     * @param {object} oODataModel
     * @param {object} oTransportationViewModel
     */
    let TransportationCalculateTotals = Object.extend('com.pepsico.dev.reference.masterDetailTransactional.model.TransportationCalculateTotals', {
        constructor: function ({
                                   oTransportationViewModel = undefined,
                               } = {}) {
            Object.apply(this);
            this._oTransportationViewModel = oTransportationViewModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        init: function () {
            this.initReactions();
        },
        initReactions: function () {
            JSONModelExtensions.attachListChanged({
                oJSONModel: this._oTransportationViewModel,
                sPath: "/TransportationDetails/TransportationItems",
                fnHandler: () => {
                    if (this._oTransportationViewModel.getProperty("/TransportationDetailsViewProps/IsEditMode")) {
                        alert("recalculateTotals");
                    }
                }
            });
        },
        recalculateTotals: function () {
            let oTotals = this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems")
                .reduce((oAccumulator, oCurrentItem) => ({
                        TotalVolume: oAccumulator.TotalVolume + oCurrentItem.Volume,
                        TotalWeight: oAccumulator.TotalWeight + oCurrentItem.Weight,
                    }),
                    {TotalVolume: 0, TotalWeight: 0});
            this._oTransportationViewModel.setProperty("/TransportationDetails/TransportationHeader/TotalVolume", oTotals.TotalVolume);
            this._oTransportationViewModel.setProperty("/TransportationDetails/TransportationHeader/TotalVolume", oTotals.TotalWeight);
        }

    });
    return TransportationCalculateTotals;
});