sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	function getFrameUrl (sHash, sUrlParameters) {
		var sUrl = jQuery.sap.getResourcePath("com/pepsico/reference/masterDetail/pepsico_mater_detail_reference_app/app", ".html");
		sHash = sHash || "";
		sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";

		if (sHash) {
			sHash = "#PepsiCoMasterDetailReferenceApplication-display&/" + (sHash.indexOf("/") === 0 ? sHash.substring(1) : sHash);
		} else {
			sHash = "#PepsiCoMasterDetailReferenceApplication-display";
		}

			return sUrl + sUrlParameters + sHash;
	}

	return Opa5.extend("com.pepsico.reference.masterDetail.pepsico_mater_detail_reference_app.test.integration.arrangements.Arrangement", {

		iStartTheApp : function (oOptions) {
			oOptions = oOptions || {};
			// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
			this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, "serverDelay=50"));
		},

		iStartTheAppWithDelay : function (sHash, iDelay) {
			this.iStartMyAppInAFrame(getFrameUrl(sHash, "serverDelay=" + iDelay));
		},

		iStartMyAppOnADesktopToTestErrorHandler : function (sParam) {
			this.iStartMyAppInAFrame(getFrameUrl("", sParam));
		}
	});
});
