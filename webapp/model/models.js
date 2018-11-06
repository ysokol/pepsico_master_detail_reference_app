sap.ui.define([
		"sap/ui/model/json/JSONModel",
		"sap/ui/Device",
		"sap/m/Column",
		"sap/m/Label",
	], function (JSONModel, Device) {
		"use strict";

		return {
			createDeviceModel: function () {
				const oModel = new JSONModel(Device);
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			},
			createFLPModel: function () {
				const fnGetuser = jQuery.sap.getObject("sap.ushell.Container.getUser"),
					bIsShareInJamActive = fnGetuser ? fnGetuser().isJamActive() : false,
					oModel = new JSONModel({
						isShareInJamActive: bIsShareInJamActive
					});
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			},
			createAppViewMode: function () {
				return new JSONModel({
					layout: "OneColumn",
					previousLayout: "",
					actionButtonsInfo: {
						midColumn: {
							fullScreen: false
						}
					}
				});
			},
			createTransportationViewModel: function () {
				return new JSONModel({
					TransportationListViewProps: this.createTransportationListViewProps(),
					TransportationDetails: this.createTransportationDetails(),
					TransportationDetailsViewProps: this.createTransportationDetailsViewProps(),
					NewTransportationItemDetails: this.createTransportationItemDetails(),
					NewTransportationDetails: this.createTransportationDetails(),
				});
			},
			createTransportationDetails: function() {
				return {
					TransportationNum: "",
					Status: "",
					Region: "",
					RegionDetails: {
						Description: ""
					},
					KickOffDate: new Date(),
					ShipFrom: "",
					ShipFromDetails: {
						Description: ""
					},
					ShipTo: "",
					ShipToDetails: {
						Description: ""
					},
					Truck: "",
					TruckDetails: {
						Description: ""
					},
					Comment: "",
					TotalPriceRub: "0.00",
					TotalVolume: "0.00",
					VolumeUom: "",
					TotalWeight: "0.00",
					WeightUom: "",
					TravelMileageKm: 0,
					TransportationItems: [],
				};
			},
			createTransportationItemDetails: function() {
				return {
					ItemNum: "",
					Material: "",
					MaterialDetails: {
						Description: ""
					},
					Description: "",
					Quantity: "0.00",
					QuantityUom: "",
					Volume: "0.00",
					VolumeUom: "",
					Weight: "0.00",
					WeightUom: "",
					_ErrorStatus: ""
				};
			},
			createTransportationListViewProps: function() {
				return  {
					BusyIndicator: false,
				};
			},
			createTransportationDetailsViewProps: function() {
				return {
					IsEditMode: false,
					BusyIndicator: false,
				};
			},
			/*getTransportationViewModelInitialState() {
				return;
			},*/
			createMasterDataModel: function () {
				return new JSONModel({
					Materials: [
						{Material: "00010", Description: "Wheat"},
						{Material: "00020", Description: "Buckwheat"},
						{Material: "00030", Description: "Corn"},
					],
					Regions: [
						{Region: "77", Description: "gorod Moskva"},
						{Region: "46", Description: "Kurskaya oblast"},
						{Region: "50", Description: "Moscowskaya oblast"}
					],
					UnitOfMeasures: [
						{Uom: "KG", Description: "Kilogram"},
						{Uom: "PC", Description: "Piece"},
						{Uom: "M3", Description: "Cubic Meter"}
					],
				});
			}
		};

	}
);