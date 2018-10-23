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
                               } = {}) {
            Object.apply(this);
            this._oTranportationRepository = oTransportationRepository;
            this._oTransportationViewModel = oTransportationViewModel;
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
        submitChanges: function() {
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
            this._oTranportationRepository.resetChanges();
            /*let oTransportationDetails = this._oTransportationViewModel.getProperty("/TransportationDetails");
            this._oTranportationRepository.refreshFromODataModelCache(oTransportationDetails);
            this._oTransportationViewModel.setProperty("/TransportationDetails", oTransportationDetails);
            this._oTransportationViewModel.setProperty("/TransportationDetailsViewProps/IsEditMode", false);*/
            return new Promise((fnResolve, fnReject) =>
                this._oTranportationRepository.readTransportation(
                    this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationHeader/__metadata/localODataPath"))
                    .then(oTransportationDetails => {
                        this._oTransportationViewModel.setProperty("/TransportationDetails", oTransportationDetails);
                        this._oTransportationViewModel.setProperty("/TransportationDetailsViewProps/IsEditMode", false);
                        fnResolve(oTransportationDetails);
                    })
            );
        },
    });
    return TransportationEdit;
});