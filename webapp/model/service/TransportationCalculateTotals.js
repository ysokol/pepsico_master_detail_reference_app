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
	                               oI18nModel = undefined,
                               } = {}) {
            Object.apply(this);
            this._oTransportationViewModel = oTransportationViewModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        init: function () {
            //this.initReactions();
        },
        /*initReactions: function () {
            JSONModelExtensions.attachListChanged({
                oJSONModel: this._oTransportationViewModel,
                sPath: "/TransportationDetails/TransportationItems",
                fnHandler: () => {
                    if (this._oTransportationViewModel.getProperty("/TransportationDetailsViewProps/IsEditMode")) {
                        this.recalculateTotals();
                        this.recalculatePrice();
                    }
                }
            });
            JSONModelExtensions.attachPropertyChanged({
                oJSONModel: this._oTransportationViewModel,
                sPath: "/TransportationDetails/TravelMileageKm",
                fnHandler: () => {
                    if (this._oTransportationViewModel.getProperty("/TransportationDetailsViewProps/IsEditMode")) {
                        this.recalculatePrice();
                    }
                }
            });
        },*/
        recalculateTotals: function () {
            let oTotals = this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems")
                .reduce((oAccumulator, oCurrentItem) => ({
                        TotalVolume: (parseFloat(oAccumulator.TotalVolume) +
                            parseFloat(oCurrentItem.Volume)).toFixed(2).toString(),
                        TotalWeight: (parseFloat(oAccumulator.TotalWeight)+
                            parseFloat(oCurrentItem.Weight)).toFixed(2).toString(),
                    }),
                    {TotalVolume: "0.00", TotalWeight: "0.00"});
            this._oTransportationViewModel.setProperty("/TransportationDetails/TotalVolume", oTotals.TotalVolume);
            this._oTransportationViewModel.setProperty("/TransportationDetails/TotalWeight", oTotals.TotalWeight);
        },
        recalculatePrice: function () {
            this._oTransportationViewModel.setProperty("/TransportationDetails/TotalPriceRub",
	            (parseFloat(this._oTransportationViewModel.getProperty("/TransportationDetails/TravelMileageKm")) * 100 +
	            parseFloat(this._oTransportationViewModel.getProperty("/TransportationDetails/TotalWeight")) * 10).toFixed(2).toString());
        }

    });
    return TransportationCalculateTotals;
});