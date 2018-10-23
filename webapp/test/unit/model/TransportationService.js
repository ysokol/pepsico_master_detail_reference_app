/*global QUnit*/

sap.ui.define([
    "com/pepsico/dev/reference/masterDetailTransactional/model/TransportationService",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (TransportationService, ODataModel) {
    "use strict";

    QUnit.module("TransportationService", {
        /*afterEach : function () {
            this.oDeviceModel.destroy();
        }*/
    });

    let fnCreateODataModel = function () {
        return new ODataModel(
            "/odata", {
                json: true,
                useBatch: true,
                defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
                defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put,
                loadMetadataAsync: false,
                tokenHandling: true
            }
        )
    };

    let fnCreateTransportationService = function() {
        return new TransportationService({
            oODataModel: fnCreateODataModel(),
            oTransportationViewModel: undefined
        });
    };

    QUnit.test("Get Next Number", function (assert) {
        let oTransportationService = fnCreateTransportationService();
        let fbDone = assert.async();
        oTransportationService.getNextTransportationNum().then((sNum) => {
            assert.strictEqual(sNum, "1070", "Incorrect next number");
            fbDone();
        });


    });

});