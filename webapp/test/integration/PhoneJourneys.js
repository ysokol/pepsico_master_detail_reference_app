sap.ui.define([
	"sap/ui/test/Opa5",
	"com/pepsico/dev/reference/masterDetailTransactional/test/integration/arrangements/Arrangement",
	"com/pepsico/dev/reference/masterDetailTransactional/test/integration/NavigationJourneyPhone",
	"com/pepsico/dev/reference/masterDetailTransactional/test/integration/NotFoundJourneyPhone",
	"com/pepsico/dev/reference/masterDetailTransactional/test/integration/BusyJourneyPhone"
], function (Opa5, Arrangement) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		viewNamespace: "com.pepsico.dev.reference.masterDetailTransactional.view.",
		autoWait: true
	});
});
