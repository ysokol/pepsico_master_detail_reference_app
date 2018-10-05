sap.ui.define([
	"sap/ui/test/Opa5",
	"com/pepsico/reference/masterDetail/pepsico_mater_detail_reference_app/test/integration/arrangements/Arrangement",
	"com/pepsico/reference/masterDetail/pepsico_mater_detail_reference_app/test/integration/NavigationJourneyPhone",
	"com/pepsico/reference/masterDetail/pepsico_mater_detail_reference_app/test/integration/NotFoundJourneyPhone",
	"com/pepsico/reference/masterDetail/pepsico_mater_detail_reference_app/test/integration/BusyJourneyPhone"
], function (Opa5, Arrangement) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		viewNamespace: "com.pepsico.reference.masterDetail.pepsico_mater_detail_reference_app.view.",
		autoWait: true
	});
});
