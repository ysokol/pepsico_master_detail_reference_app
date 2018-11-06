sap.ui.define([
	"com/pepsico/dev/reference/masterDetailTransactional/controller/BaseController",
	"sap/ui/model/json/JSONModel",
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.pepsico.dev.reference.masterDetailTransactional.controller.App", {

		onInit: function() {
			sap.ui.core.BusyIndicator.show(0);
			this.getOwnerComponent().getModel().metadataLoaded().then(() => sap.ui.core.BusyIndicator.hide());
			this.getOwnerComponent().getModel().attachMetadataFailed(() => sap.ui.core.BusyIndicator.hide());
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}

	});
});