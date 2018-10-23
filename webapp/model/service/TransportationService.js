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
     * @param {object} oODataModel
     * @param {object} oTransportationViewModel
     */
    let TransportationService = Object.extend('com.pepsico.dev.reference.masterDetailTransactional.model.TransportationService', {
        constructor: function ({
                                   oTransportationRepository = undefined,
                                   oODataModel = undefined,
                                   oTransportationViewModel = undefined,

                               } = {}) {
            Object.apply(this);
            this._oTranportationRepository = oTransportationRepository;
            this._oTransportationViewModel = oTransportationViewModel;
            this._oODataModel = oODataModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        init: function () {
            //this.initCreateTransportationDialogReactions();
            //this.initTransportationDetailsReactions();
        },
        initTransportationDetailsReactions: function () {
            /*JSONModelExtensions.attachPropertyChanged({
                oJSONModel: this._oTransportationViewModel,
                sPath: "/NewTransportationDetails/Region",
                fnHandler: () => {
                    this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFrom", "");
                    if (this._oTransportationViewModel.getProperty("/NewTransportationDetails/Region")) {
                        ODataModelExtensions.readPromise(this._oODataModel, "/ShippingLocations", {
                            urlParameters: {
                                "$filter": "Region eq '" + this._oTransportationViewModel.getProperty("/NewTransportationDetails/Region") + "'"
                            }
                        })
                            .then((oResult) => this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFromList", oResult.results));
                    } else {
                        this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFromList", []);
                    }
                }
            });*/
        },
        validateTransportationDeletion: function() {
            return true;
        },
        clearCreateTransportationDetailsProps: function() {
            this._oTransportationViewModel.setProperty("/TransportationDetails",
                models.getTransportationViewModelInitialState().TransportationDetails);
        },
        deleteTransportation: function (sPath) {
            return this._oTranportationRepository.deleteTransportation(sPath);
        },
        submitChanges: function () {
            return ODataModelExtensions.submitChangesPromise(this._oODataModel);
        },
        resetChanges: function () {

        },
        readTransportationDetails: function (sPath) {
            return new Promise((fnResolve, fnReject) =>
                this._oTranportationRepository.readTransportation(sPath)
                    .then(oTransportationDetails => {
                        debugger;
                        this._oTransportationViewModel.setProperty("/TransportationDetails", oTransportationDetails);
                        fnResolve(oTransportationDetails);
                    })
            );
        },
        onNewTransportationRegionChanged: function () {

        },
        hasPendingChanges: function () {
            return this._oODataModel.hasPendingChanges();
        }

    });
    return TransportationService;
});