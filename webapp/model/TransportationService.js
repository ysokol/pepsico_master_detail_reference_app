sap.ui.define([
	'sap/ui/base/Object',
	'com/pepsico/core/sap/ui/model/odata/v2/ODataModelExtensions',
	'com/pepsico/core/sap/ui/model/json/JSONModelExtensions'
], function(Object, ODataModelExtensions, JSONModelExtensions) {
	'use strict';
	return Object.extend('com.pepsico.reference.masterDetail.pepsico_mater_detail_reference_app.model.TransportationService', {
		constructor: function({
			oODataModel = undefined,
			oTransportationViewModel = undefined
		} = {}) {
			Object.apply(this);
			this._oTransportationViewModel = oTransportationViewModel;
			this._oODataModel = oODataModel;
		},
		init: function() {
			this.initNewTransportationDialogReactions();
		},
		initNewTransportationDialogReactions: function() {
			JSONModelExtensions.attachPropertyChanged({
				oJSONModel: this._oTransportationViewModel,
				sPath: "/NewTransportationDetails/Region",
				fnHandler: () => {
					this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShippingLocationKey", "");
					let aShipFromList = [];
					ODataModelExtensions.readPromise(this._oODataModel, "/ShippingLocations", {
							urlParameters: {
								"$filter": "Region eq '" + this._oTransportationViewModel.getProperty("/NewTransportationDetails/Region") + "'"
							}
						})
						.then((oResult) => this._oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFromList", oResult.results));
				}
			});
			JSONModelExtensions.attachPropertyChanged({
				oJSONModel: this._oTransportationViewModel,
				sPath: "/NewTransportationDetails/ShipFrom",
				fnHandler: () => alert("ShipFromChanged")
			});
		},
		createTransportation: function(oNewTransportationDetails) {

		},
		removeTransportation: function() {

		},
		readTransportation: function() {

		},
		onNewTransportationRegionChanged: function() {

		},

	});
});