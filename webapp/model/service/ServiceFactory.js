sap.ui.define([
    "sap/ui/base/Object",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationService",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationItemService",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationCalculateTotals",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationCreate",
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/TransportationEdit",
], function (Object, TransportationService, TransportationItemService, TransportationCalculateTotals,
             TransportationCreate, TransportationEdit) {
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
                                   oI18nModel = undefined,
                                   oTransportationRepository = undefined,
                                   oShippingLocationRepository = undefined
                               } = {}) {
            Object.apply(this);
            this._oTransportationViewModel = oTransportationViewModel;
            this._oODataModel = oODataModel;
            this._oI18nModel = oI18nModel;
            this._oTransportationRepository = oTransportationRepository;
            this._oShippingLocationRepository = oShippingLocationRepository;
            this._buildServices();
        },
        _buildServices: function() {
            this._oTransportationService = new TransportationService({
                oODataModel: this._oODataModel,
                oTransportationRepository: this._oTransportationRepository,
                oTransportationViewModel: this._oTransportationViewModel,
                oI18nModel: this._oI18nModel,
            });
            this._oTransportationService.init();

            this._oTransportationCalculateTotals = new TransportationCalculateTotals({
                oTransportationViewModel: this._oTransportationViewModel,
                oI18nModel: this._oI18nModel,
            });
            this._oTransportationCalculateTotals.init();

	        this._oTransportationItemService = new TransportationItemService({
		        oTransportationRepository: this._oTransportationRepository,
		        oTransportationViewModel: this._oTransportationViewModel,
		        oTransportationCalculateTotals: this._oTransportationCalculateTotals,
		        oI18nModel: this._oI18nModel,
	        });
	        this._oTransportationItemService.init();

            this._oTransportationCreate = new TransportationCreate({
                oTransportationRepository: this._oTransportationRepository,
                oShippingLocationRepository: this._oShippingLocationRepository,
                oTransportationViewModel: this._oTransportationViewModel,
                oI18nModel: this._oI18nModel,
            });
            this._oTransportationCreate.init();

            this._oTransportationEdit = new TransportationEdit({
                oTransportationRepository: this._oTransportationRepository,
                oTransportationViewModel: this._oTransportationViewModel,
	            oTransportationItemService: this._oTransportationItemService,
	            oI18nModel: this._oI18nModel,
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