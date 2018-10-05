sap.ui.define([
	"com/pepsico/reference/masterDetail/pepsico_mater_detail_reference_app/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.pepsico.reference.masterDetail.pepsico_mater_detail_reference_app.controller.NotFound", {

			onInit: function () {
				this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
			},

			_onNotFoundDisplayed : function () {
					this.getModel("appView").setProperty("/layout", "OneColumn");
			}
		});
	}
);
