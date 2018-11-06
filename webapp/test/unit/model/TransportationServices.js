/*global QUnit*/

sap.ui.define([
    "com/pepsico/dev/reference/masterDetailTransactional/model/service/ServiceFactory",
    "com/pepsico/dev/reference/masterDetailTransactional/model/models",
    "com/pepsico/dev/reference/masterDetailTransactional/test/unit/model/mock/TransportationRepository",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (ServiceFactory, models, TransportationRepository) {
    "use strict";

    QUnit.module("Transportation Services Test", {
        /*afterEach : function () {
            this.oDeviceModel.destroy();
        }*/
    });

    let _oServiceFactory = undefined;
    let _oTransportationViewModel = models.createTransportationViewModel();
    let fnGetServiceFactory = function() {
        return new Promise((fnResolve, fnReject) => {
            $.getJSON("./model/mock/Transportations.json", function (oData) {
                if (_oServiceFactory) {
                    fnResolve(_oServiceFactory);
                    return;
                }
                _oServiceFactory = new ServiceFactory({
                    oODataModel: undefined,
                    oTransportationViewModel: _oTransportationViewModel,
                    oI18nModel: undefined,
                    oTransportationRepository: new TransportationRepository(oData),
                    oShippingLocationRepository: undefined
                });
                fnResolve(_oServiceFactory);
            });
        });
    };

    QUnit.test("Init Services", function (assert) {
        let fnDone = assert.async();
        fnGetServiceFactory().then(oServiceFactory => {
            assert.ok(true, "Services Created");
            fnDone();
        });
    });
    QUnit.test("Scenario Create Draft => Read => Add Details => Save => Read again => Delete", function (assert) {
        let fnDone = assert.async();
        let sTransportationPath = undefined;
        fnGetServiceFactory().then(() => {
            _oTransportationViewModel.setProperty("/NewTransportationDetails/Region", "46");
	        _oServiceFactory.getTransportationCreate().onRegionChanged();
            _oTransportationViewModel.setProperty("/NewTransportationDetails/ShipFrom", "1000");
            return _oServiceFactory.getTransportationCreate().createTransportation()
        })
            .then(oNewTransportation => {
                sTransportationPath = oNewTransportation.__metadata.localODataPath;
                assert.strictEqual(oNewTransportation.TransportationNum, "1010", "Check new transportation number");
                return _oServiceFactory.getTransportationService().readTransportationDetails(sTransportationPath);
            })
            .then(() => {
                assert.strictEqual(_oTransportationViewModel.getProperty("/TransportationDetails/TransportationNum"), "1010",
                    "Check read transportation number");
                _oServiceFactory.getTransportationEdit().activateEditMode();
                _oTransportationViewModel.setProperty("/TransportationDetails/ShipTo", "2000");
                _oTransportationViewModel.setProperty("/TransportationDetails/KickOffDate", new Date());
	            _oTransportationViewModel.setProperty("/TransportationDetails/TravelMileageKm", 10);
	            _oServiceFactory.getTransportationCalculateTotals().recalculatePrice();
                _oServiceFactory.getTransportationItemService().initCreateTransportationItemProps();
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Material", "00010");
	            _oServiceFactory.getTransportationItemService().onMaterialChanged();
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Description", "Wheat");
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Quantity", "100.00");
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/QuantityUom", "KG");
	            _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Weight", "100.00");
	            _oTransportationViewModel.setProperty("/NewTransportationItemDetails/WeightUom", "KG");
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Volume", "1.00");
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/VolumeUom", "M3");
                return _oServiceFactory.getTransportationItemService().createTransportationItem();
            })
            .then(() => {
                _oServiceFactory.getTransportationItemService().initCreateTransportationItemProps();
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Material", "00020");
	            _oServiceFactory.getTransportationItemService().onMaterialChanged();
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Description", "Buckwheat");
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Quantity", "200.00");
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/QuantityUom", "KG");
	            _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Weight", "200.00");
	            _oTransportationViewModel.setProperty("/NewTransportationItemDetails/WeightUom", "KG");
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Volume", "2.00");
                _oTransportationViewModel.setProperty("/NewTransportationItemDetails/VolumeUom", "M3");
                return _oServiceFactory.getTransportationItemService().createTransportationItem();
            })
	        .then(() => {
		        _oServiceFactory.getTransportationItemService().initCreateTransportationItemProps();
		        _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Material", "00030");
		        _oServiceFactory.getTransportationItemService().onMaterialChanged();
		        _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Description", "Corn");
		        _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Quantity", "300.00");
		        _oTransportationViewModel.setProperty("/NewTransportationItemDetails/QuantityUom", "KG");
		        _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Weight", "300.00");
		        _oTransportationViewModel.setProperty("/NewTransportationItemDetails/WeightUom", "KG");
		        _oTransportationViewModel.setProperty("/NewTransportationItemDetails/Volume", "3.00");
		        _oTransportationViewModel.setProperty("/NewTransportationItemDetails/VolumeUom", "M3");
		        return _oServiceFactory.getTransportationItemService().createTransportationItem();
	        })
            .then(() => {
                assert.strictEqual(_oServiceFactory.getTransportationEdit().hasPendingChanges(), true,
                    "Check that has pending changes");
                return _oServiceFactory.getTransportationEdit().submitChanges();
            })
            .then(() => {
                return _oServiceFactory.getTransportationService().readTransportationDetails("Transportations('1000')");
            })
            .then(() => {
                return _oServiceFactory.getTransportationService().readTransportationDetails(sTransportationPath);
            })
            .then(() => {
	            assert.strictEqual(_oTransportationViewModel.getProperty("/TransportationDetails/ShipFrom"), "1000",
		            "Check ship-from");
            	assert.equal(_oTransportationViewModel.getProperty("/TransportationDetails/ShipTo"), "2000",
                    "Check ship-to");
	            assert.strictEqual(_oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems").length, 3,
		            "Check transportation item count");
            	assert.equal(_oTransportationViewModel.getProperty("/TransportationDetails/TotalWeight"), 600,
		            "Check total weight");
	            assert.equal(_oTransportationViewModel.getProperty("/TransportationDetails/TotalVolume"), 6,
		            "Check total volume");
	            assert.equal(_oTransportationViewModel.getProperty("/TransportationDetails/TotalPriceRub"), 10*100 + 600*10,
		            "Check total price");
                return _oServiceFactory.getTransportationService().deleteTransportation(sTransportationPath);
            })
            .then(() => {
                return _oServiceFactory.getTransportationService().readTransportationDetails(sTransportationPath);
            })
            .then(oTransportation => {
                assert.ok(!oTransportation, "Check that transportation deleted");
                fnDone();
            })
            .catch(oError => {
                assert.ok(false, "FAILED");
                alert(oError.toString());
                fnDone();
            });

    });

});