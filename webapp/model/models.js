sap.ui.define([
		"sap/ui/model/json/JSONModel",
		"sap/ui/Device"
	], function (JSONModel, Device) {
		"use strict";

		return {
			createDeviceModel : function () {
				var oModel = new JSONModel(Device);
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			},

			createFLPModel : function () {
				var fnGetuser = jQuery.sap.getObject("sap.ushell.Container.getUser"),
					bIsShareInJamActive = fnGetuser ? fnGetuser().isJamActive() : false,
					oModel = new JSONModel({
						isShareInJamActive: bIsShareInJamActive
					});
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			},
			
			createTransportationViewModel : function () {
				return new JSONModel({
					TransportationListParams: {
						Filters: [],
						Sorters: [],
						GroupBy: []
					},
					TransportationDetails: {
						IsEditMode: false,
						TransportationPath: ''
					},
					NewTransportationDetails: {
						Region: "",
						RegionDescription: "",
						ShippingLocationKey: "",
						Description: "",
						RegionList: [
							{Region: "77", RegionDescription: "gorod Moskva"},
							{Region: "46", RegionDescription: "Kurskaya oblast"},
							{Region: "50", RegionDescription: "Moscowskaya oblast"}
						],
						ShipFromList: []
					}
				});
			}
		};

	}
);