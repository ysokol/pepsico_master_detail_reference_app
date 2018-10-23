sap.ui.define([
    'sap/ui/base/Object',
    'com/pepsico/core/sap/ui/model/odata/v2/ODataModelExtensions',
    'com/pepsico/core/sap/ui/model/json/JSONModelExtensions',
    "com/pepsico/dev/reference/masterDetailTransactional/model/models"
], function (Object, ODataModelExtensions, JSONModelExtensions, models) {
    'use strict';
    /**
     * ShippingLocationRepository class
     *
     * Repository for ShippingLocation Entity. Implements only Read operation.
     *
     * @class ShippingLocationRepository
     * @param {object} oODataModel
     */
    let ShippingLocationRepository = Object.extend('com.pepsico.dev.reference.masterDetailTransactional.model.repository.ShippingLocationRepository', {
        constructor: function ({
                                   oODataModel = undefined
                               } = {}) {
            Object.apply(this);
            this._oODataModel = oODataModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        findShippingLocationsByRegionAndType: function (sRegion, sType) {
            return new Promise((fnResolve, fnReject) => {
                ODataModelExtensions.readPromise(this._oODataModel, "/ShippingLocations", {
                    urlParameters: {
                        "$filter": "Region eq '" + sRegion + "'"
                    }
                })
                    .then(oData => fnResolve(oData.results));
            });

        },
    });
    return ShippingLocationRepository;
});