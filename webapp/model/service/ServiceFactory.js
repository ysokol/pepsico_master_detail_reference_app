sap.ui.define([
    "sap/ui/base/Object",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationService",
    "com/pepsico/dev/reference/masterDetailTransactional/model/repository/TransportationRepository",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationItemService",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationCalculateTotals",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationCreate",
    "com/pepsico/dev/reference/masterDetailTransactional/model/repository/ShippingLocationRepository",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationEdit",
], function (Object, TransportationService, TransportationRepository, TransportationItemService, TransportationCalculateTotals,
             TransportationCreate, ShippingLocationRepository, TransportationEdit) {
    'use strict';
    /**
     * ServiceFactory class
     *
     * Class used for instantiating and providing access to all service and data access classes.
     * Instance of this class created in Component.init() method, before any other application logic is called.
     * Controllers accessing this class instance from Component and get Service Class instances from it.
     *
     * @class ServiceFactory
     * @param {object} oODataModel
     * @param {object} oTransportationViewModel
     */
    let ServiceFactory = Object.extend('com.pepsico.dev.reference.masterDetailTransactional.model.service.ServiceFactory', {
        constructor: function ({
                                   oODataModel = undefined,
                                   oTransportationViewModel = undefined,
                               } = {}) {
            Object.apply(this);
            this._oTransportationViewModel = oTransportationViewModel;
            this._oODataModel = oODataModel;
            this._buildServices();
        },
        _buildServices: function() {
            this._oTransportationRepository = new TransportationRepository({
                oODataModel: this._oODataModel
            });

            this._oShippingLocationRepository = new ShippingLocationRepository({
                oODataModel: this._oODataModel
            });

            this._oTransportationService = new TransportationService({
                oODataModel: this._oODataModel,
                oTransportationRepository: this._oTransportationRepository,
                oTransportationViewModel: this._oTransportationViewModel,
            });
            this._oTransportationService.init();

            this._oTransportationItemService = new TransportationItemService({
                oTransportationRepository: this._oTransportationRepository,
                oTransportationViewModel: this._oTransportationViewModel,
            });
            this._oTransportationItemService.init();

            this._oTransportationCalculateTotals = new TransportationCalculateTotals({
                oTransportationViewModel: this._oTransportationViewModel,
            });
            this._oTransportationCalculateTotals.init();

            this._oTransportationCreate = new TransportationCreate({
                oTransportationRepository: this._oTransportationRepository,
                oShippingLocationRepository: this._oShippingLocationRepository,
                oTransportationViewModel: this._oTransportationViewModel,
            });
            this._oTransportationCreate.init();

            this._oTransportationEdit = new TransportationEdit({
                oTransportationRepository: this._oTransportationRepository,
                oTransportationViewModel: this._oTransportationViewModel,
            });
            this._oTransportationEdit.init();
        },
        getTransportationService() {
            return this._oTransportationService;
        },
        getTransportationItemService() {
            return this._oTransportationItemService;
        },
        getTransportationCalculateTotals() {
            return this._oTransportationCalculateTotals;
        },
        getTransportationCreate() {
            return this._oTransportationCreate;
        },
        getTransportationEdit() {
            return this._oTransportationEdit;
        }
    });
    return ServiceFactory;
});