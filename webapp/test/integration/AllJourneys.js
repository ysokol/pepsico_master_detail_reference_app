// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 Transportations in the list
// * All 3 Transportations have at least one TransportationItemDetails

sap.ui.define([
	"sap/ui/test/Opa5",
	"com/pepsico/dev/reference/masterDetailTransactional/test/integration/arrangements/Arrangement","com/pepsico/dev/reference/masterDetailTransactional/test/integration/MasterJourney",
	"com/pepsico/dev/reference/masterDetailTransactional/test/integration/NavigationJourney",
	"com/pepsico/dev/reference/masterDetailTransactional/test/integration/NotFoundJourney",
	"com/pepsico/dev/reference/masterDetailTransactional/test/integration/BusyJourney",
	"com/pepsico/dev/reference/masterDetailTransactional/test/integration/FLPIntegrationJourney"
], function (Opa5, Arrangement) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Arrangement(),
		viewNamespace: "com.pepsico.dev.reference.masterDetailTransactional.view.",
		autoWait: true
	});
});
