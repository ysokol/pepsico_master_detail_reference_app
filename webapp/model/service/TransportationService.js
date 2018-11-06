sap.ui.define([
    'sap/ui/base/Object',
    'com/pepsico/core/sap/ui/model/odata/v2/ODataModelExtensions',
    'com/pepsico/core/sap/ui/model/json/JSONModelExtensions',
    "com/pepsico/dev/reference/masterDetailTransactional/model/models"
], function (Object, ODataModelExtensions, JSONModelExtensions, models) {
    'use strict';
    /**
     * TransportationService class
     *
     * Class Implements logic for Edit Transportation scenario (validations, reactions)
     *
     * @class TransportationService
     * @param {object} oTransportationRepository
     * @param {object} oTransportationViewModel
     */
    let TransportationService = Object.extend('com.pepsico.dev.reference.masterDetailTransactional.model.TransportationService', {
        constructor: function ({
                                   oTransportationRepository = undefined,
                                   oTransportationViewModel = undefined
                               } = {}) {
            Object.apply(this);
            this._oTranportationRepository = oTransportationRepository;
            this._oTransportationViewModel = oTransportationViewModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        init: function () {
        },
        validateTransportationDeletion: function() {
            return true;
        },
        deleteTransportation: function (sPath) {
            return this._oTranportationRepository.deleteTransportation(sPath);
        },
        resetTransportationDetailsProps: function () {
            this._oTransportationViewModel.setProperty("TransportationDetails", models.createTransportationDetails());
        },
        readTransportationDetails: function (sPath) {
            this._oTransportationViewModel.setProperty("/TransportationDetailsViewProps/IsEditMode", false);
            return new Promise((fnResolve, fnReject) =>
                this._oTranportationRepository.readTransportation(sPath)
                    .then(oTransportationDetails => {
                        this._oTransportationViewModel.setProperty("/TransportationDetails", oTransportationDetails);
                        fnResolve(oTransportationDetails);
                    })
                    .catch(oException => fnReject(oException))
            );
        },

    });
    return TransportationService;
});