sap.ui.define([
	"com/pepsico/dev/reference/masterDetailTransactional/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.pepsico.dev.reference.masterDetailTransactional.controller.NotFound", {

			onInit: function () {
				this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
			},

			_onNotFoundDisplayed : function () {
					this.getModel("appView").setProperty("/layout", "OneColumn");
			}
		});
	}
);
