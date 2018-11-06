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
		constructor: function (aTransportationsList) {
			Object.apply(this);
			this._aTransportationsList = [];
			aTransportationsList.forEach(oItem => this._aTransportationsList.push(this._convertTransportation(oItem)));
			//this._oMessageManager = sap.ui.getCore().getMessageManager();
			this._hasPendingChanges = false;
		},
		createTransportationHeader: function (oTransportationHeader) {
			return new Promise((fnResolve, fnReject) => setTimeout(() => {
					let oConvertedTransportation = this._convertTransportation(this._copyObject(oTransportationHeader));
					oConvertedTransportation.TransportationItems = [];
					this._aTransportationsList.push(oConvertedTransportation);
					fnResolve(this._copyObject(oConvertedTransportation));
				}, 100)
			);
		},
		readTransportation: function (sPath) {
			return new Promise((fnResolve, fnReject) =>
				setTimeout(() =>
						fnResolve(this._copyObject(this._aTransportationsList.find(oItem => oItem.__metadata.localODataPath === sPath))),
					100)
			);
		},
		updateODataModel: function (oTransportationDetails) {
			this._aTransportationsList = this._aTransportationsList.map(oItem =>
				(oItem.__metadata.localODataPath === oTransportationDetails.__metadata.localODataPath) ?
					this._copyObject(oTransportationDetails) : oItem
			);
			this._hasPendingChanges = true;
		},
		refreshFromODataModelCache: function (oTransportationDetails) {
			throw "Not implemented";
		},
		hasPendingChanges: function () {
			return this._hasPendingChanges;
		},
		submitChanges: function () {
			return new Promise((fnResolve, fnReject) => setTimeout(() => {
					this._hasPendingChanges = false;
					fnResolve();
				}, 100)
			);
		},
		resetChanges: function () {
			this._hasPendingChanges = false;
		},
		deleteTransportation: function (sPath) {
			return new Promise((fnResolve, fnReject) => setTimeout(() => {
					this._aTransportationsList = this._aTransportationsList.filter(oItem =>
						oItem.__metadata.localODataPath !== sPath);
					fnResolve();
				}, 100)
			);
		},
		createTransportationItem: function (sTransportationPath, oNewTransportationItem) {
			const oConvertedTransportationItem = this._convertTransportationItem(this._copyObject(oNewTransportationItem));
			return new Promise((fnResolve, fnReject) => setTimeout(() => {
					this._aTransportationsList.find(oItem => oItem.__metadata.localODataPath === sTransportationPath)
						.TransportationItems.push(oConvertedTransportationItem);
					fnResolve(this._copyObject(oConvertedTransportationItem));
				}, 100)
			);
		},
		deleteTransportationItem: function (sPath) {
			return new Promise((fnResolve, fnReject) => setTimeout(() => {
					this._aTransportationsList.forEach(oTransportation => {
						oTransportation.TranportationItems = oTransportation.TranportationItems.filter(oItem =>
							oItem.__metadata.localODataPath !== sPath);
					});
					fnResolve();
				}, 100)
			);
		},
		findTransportations: function () {
			return new Promise((fnResolve, fnReject) => setTimeout(() => {
					fnResolve(this._copyObject(this._aTransportationsList));
				}, 100)
			);
		},
		_copyObject: function (oObject) {
			if (oObject === null) {
				return null;
			}
			if (oObject === undefined) {
				return undefined;
			}
			return JSON.parse(JSON.stringify(oObject));
		},
		_convertTransportation(oTransportation) {
			oTransportation.__metadata = {
				localODataPath: `/Transportations('${oTransportation.TransportationNum}')`
			};
			return oTransportation;
		},
		_convertTransportationItem(oTransportationItem) {
			oTransportationItem.__metadata = {
				localODataPath: `/TransportationItems('${oTransportationItem.Transportation}', '${oTransportationItem.ItemNum}')`
			};
			return oTransportationItem;
		},
	});
	return TransportationRepository;
});