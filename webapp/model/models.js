sap.ui.define([
        "sap/ui/model/json/JSONModel",
        "sap/ui/Device"
    ], function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createFLPModel: function () {
                var fnGetuser = jQuery.sap.getObject("sap.ushell.Container.getUser"),
                    bIsShareInJamActive = fnGetuser ? fnGetuser().isJamActive() : false,
                    oModel = new JSONModel({
                        isShareInJamActive: bIsShareInJamActive
                    });
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createTransportationViewModel: function () {
                return new JSONModel(this.getTransportationViewModelInitialState());
            },
            getTransportationViewModelInitialState() {
                return {
                    TransportationListParams: {
                        Filters: [],
                        Sorters: [],
                        GroupBy: []
                    },
                    TransportationDetails: {
                        TransportationHeader: {
                            TransportationNum: "",
                            Status: "",
                            KickOffDate: "",
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
                            TotalPriceRub: 0,
                            TotalVolume: 0,
                            VolumeUom: "",
                            TotalWeight: 0,
                            WeightUom: "",
                            TravelMileageKm: 0,
                        },
                        TransportationItems: [],
                    },
                    TransportationDetailsViewProps: {
                        IsEditMode: false,
                    },
                    NewTransportationItemDetails: {
                        ItemNum: "",
                        Material: "0000",
                        Description: "1231",
                        Quantity: "0",
                        QuantityUom: "",
                        Volume: "0",
                        VolumeUom: "",
                        Weight: "0",
                        WeightUom: ""
                    },
                    NewTransportationDetails: {
                        TransportationNum: "",
                        Region: "46",
                        RegionDescription: "46",
                        ShipFrom: "1000",
                        ShipFromDescription: "1000",
                        ShipFromList: []
                    }
                };
            },
            createMasterDataModel: function() {
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
                });
            }
        };

    }
);