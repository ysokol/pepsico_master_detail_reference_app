sap.ui.define([
    'sap/ui/base/Object',
    'com/pepsico/core/sap/ui/model/odata/v2/ODataModelExtensions',
    'com/pepsico/core/sap/ui/model/json/JSONModelExtensions',
    "com/pepsico/dev/reference/masterDetailTransactional/model/models"
], function (BaseObject, ODataModelExtensions, JSONModelExtensions, models) {
    'use strict';
    /**
     * TransportationRepository class
     *
     * Repository for Transportation Entity and it’s associations (TransportationItems, ShippingLocations, Trucks).
     * Implements all CRUD operations (Create, Read, Update, Delete)
     *
     * @class TransportationRepository
     * @param {object} oODataModel
     */
    let TransportationRepository = BaseObject.extend('com.pepsico.dev.reference.masterDetailTransactional.model.TransportationRepository', {
        constructor: function ({
                                   oODataModel = undefined
                               } = {}) {
            Object.apply(this);
            this._oODataModel = oODataModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        createTransportationHeader: function (oTransportationHeader) {
            return new Promise((fnResolve, fnReject) => {
                ODataModelExtensions.createPromise(this._oODataModel,
                    "/Transportations", {
                        TransportationNum: oTransportationHeader.TransportationNum,
                        ShipFrom: oTransportationHeader.ShipFrom
                    })
                    .then(oData => fnResolve(this._convertToTransportationDetails(oData)));
            });

        },
        readTransportation: function (sPath) {
            return new Promise((fnResolve, fnReject) => {
                ODataModelExtensions.readPromise(this._oODataModel,
                    sPath, {
                        urlParameters: {
                            "$expand": "TransportationItemDetails,ShippingLocationDetails,ShippingLocationDetails1,TruckDetails"
                        }
                    })
                    .then(oData => fnResolve(this._convertToTransportationDetails(oData)));
            });
        },
        updateODataModel: function (oTransportationDetails) {
            const aTransportationHeaderProps = Object.getOwnPropertyNames(models.getTransportationViewModelInitialState().TransportationDetails.TransportationHeader);
            const aTransportationItemProps = Object.getOwnPropertyNames(models.getTransportationViewModelInitialState().NewTransportationItemDetails);
            this._updateODataEntityProps(oTransportationDetails.TransportationHeader, aTransportationHeaderProps);

            if (oTransportationDetails.TransportationItems) {
                oTransportationDetails.TransportationItems.forEach(oItem =>
                    this._updateODataEntityProps(oItem, aTransportationItemProps))
            }
        },
        _updateODataEntityProps: function (oODataEntity, aPropNames) {
            aPropNames
                .filter(sPropName => oODataEntity[sPropName] instanceof Date || ((typeof oODataEntity[sPropName]) !== "object"))
                .forEach(sPropName =>
                    this._oODataModel.setProperty(oODataEntity.__metadata.localODataPath + "/" + sPropName,
                        this._removeLocalODataPathFromEntity(oODataEntity)[sPropName])
                );
        },
        refreshFromODataModelCache: function (oTransportationDetails) {
            oTransportationDetails.TransportationHeader = this._addLocalODataPathToEntity(
                this._oODataModel.getProperty(oTransportationDetails.TransportationHeader.__metadata.localODataPath));

            if (oTransportationDetails.TransportationItems) {
                oTransportationDetails.TransportationItems.forEach(oItem =>
                    Object.assign(oItem, this._addLocalODataPathToEntity(this._oODataModel.getProperty(oItem.__metadata.localODataPath))));
            }
        },
        hasPendingChanges: function () {
            return this._oODataModel.hasPendingChanges();
        },
        submitChanges: function () {
            return ODataModelExtensions.submitChangesPromise(this._oODataModel);
        },
        resetChanges: function () {
            this._oODataModel.resetChanges();
        },
        deleteTransportation: function (sPath) {
            return ODataModelExtensions.removePromise(this._oODataModel, sPath);
        },
        createTransportationItem: function (sTransportationPath, oNewTransportationItem) {
            oNewTransportationItem.__metadata = {localODataPath: "/" + oNewTransportationItem.ItemNum};
            return Promise.resolve(oNewTransportationItem);
        },
        deleteTransportationItem: function (sPath) {
            return Promise.resolve();
            //return ODataModelExtensions.removePromise(this._oODataModel, sPath);
        },
        findTransportations: function () {
            return new Promise((fnResolve, fnReject) => {
                ODataModelExtensions.readPromise(this._oODataModel, "/Transportations")
                    .then(oData => fnResolve(oData.results));
            });
        },
        _addLocalODataPathToEntity: function (oODataEntity) {
            let oUpdatedODataEntity = JSON.parse(JSON.stringify(oODataEntity));
            oUpdatedODataEntity.__metadata.localODataPath = "/" + oODataEntity.__metadata.uri.split("/").pop();
            return oUpdatedODataEntity;
        },
        _removeLocalODataPathFromEntity: function (oODataEntity) {
            let oUpdatedODataEntity = JSON.parse(JSON.stringify(oODataEntity));
            delete oUpdatedODataEntity.__metadata.localODataPath;
            return oUpdatedODataEntity;
        },
        _copyObjectPlainProps: function (oODataEntity) {
            let oNewODataEntity = {};
            //oNewODataEntity = Object.assign(oNewODataEntity, oODataEntity);
            Object.getOwnPropertyNames(oODataEntity)
                .filter(sPropName => oODataEntity[sPropName] instanceof Date || ((typeof oODataEntity[sPropName]) !== "object"))
                .forEach(sPropName => oNewODataEntity[sPropName] = oODataEntity[sPropName]);
            return oNewODataEntity;
        },
        _convertToTransportationDetails: function (oData) {
            debugger;
            let oTransportationDetails = {};
            oTransportationDetails.TransportationHeader = this._copyObjectPlainProps(oData);
            oTransportationDetails.TransportationHeader.__metadata = oData.__metadata;
            oTransportationDetails.TransportationHeader.ShipFromDetails = oData.ShippingLocationDetails || {Description: ""};
            oTransportationDetails.TransportationHeader.ShipToDetails = oData.ShippingLocationDetails1 || {Description: ""};
            oTransportationDetails.TransportationHeader.TruckDetails = oData.TruckDetails || {Description: ""};
            oTransportationDetails.TransportationHeader = this._addLocalODataPathToEntity(oTransportationDetails.TransportationHeader);

            if (oData.TransportationItemDetails && oData.TransportationItemDetails.results) {
                oTransportationDetails.TransportationItems = oData.TransportationItemDetails.results;
                oTransportationDetails.TransportationItems.forEach(item =>
                    item.__metadata.localODataPath = "/" + item.__metadata.uri.split("/").pop()
                );
            }

            return oTransportationDetails;
        }
    });
    return TransportationRepository;
});