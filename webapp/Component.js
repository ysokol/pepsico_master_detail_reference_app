/* global document */
jQuery.sap.registerModulePath("com.pepsico.core", "/WebstormProjects/pepsico_core_library/src/"); // "/ext-resources/pepsico_core_library/src/""
sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
    	"sap/m/MessageBox",
		"com/pepsico/dev/reference/masterDetailTransactional/model/models",
		"com/pepsico/dev/reference/masterDetailTransactional/controller/ListSelector",
        "com/pepsico/core/sap/ui/base/GlobalErrorHandler",
        "com/pepsico/core/sap/ui/base/ExceptionStringifier",
    	"com/pepsico/dev/reference/masterDetailTransactional/model/repository/TransportationRepository",
    	"com/pepsico/dev/reference/masterDetailTransactional/model/repository/ShippingLocationRepository",
    	"com/pepsico/dev/reference/masterDetailTransactional/model/service/ServiceFactory",
	], function (UIComponent, Device, MessageBox, models, ListSelector, GlobalErrorHandler, ExceptionStringifier,
                 TransportationRepository, ShippingLocationRepository, ServiceFactory) {
		"use strict";

		return UIComponent.extend("com.pepsico.dev.reference.masterDetailTransactional.Component", {

			metadata : {
				manifest : "json",
				handleValidation  : true, // required for automated
			},

			init : function () {
                this.initGlobalErrorHandler();

			    this.setModel(models.createDeviceModel(), "device");
				this.setModel(models.createFLPModel(), "FLP");
				this.setModel(models.createTransportationViewModel(), "transportation");
                this.setModel(models.createMasterDataModel(), "masterData");
				this.setModel(models.createAppViewMode(), "appView");
				
				this.initServices();

				UIComponent.prototype.init.apply(this, arguments);

                this.initODataErrorHandler();
                this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "messageLog");

				this.getRouter().initialize();
			},
			initServices: function() {
                this.oListSelector = new ListSelector();

                let oTransportationRepository = new TransportationRepository({
                    oODataModel: this.getModel(),
                });

                let oShippingLocationRepository = new ShippingLocationRepository({
                    oODataModel: this.getModel(),
                });

                this.oServiceFactory = new ServiceFactory({
                    oTransportationViewModel: this.getModel("transportation"),
                    oI18nModel: this.getModel("i18n"),
                    oTransportationRepository: oTransportationRepository,
                    oShippingLocationRepository: oShippingLocationRepository
                });
			},
            initGlobalErrorHandler: function() {
                this._oGlobalErrorHandler = new GlobalErrorHandler();
                this._oGlobalErrorHandler.attachError({
                    fnHandler: (oEvent) => {
                        MessageBox.error("" + ExceptionStringifier.stringify(oEvent.oException));
                        sap.ui.core.BusyIndicator.hide();
                        this.getModel("transportation").setProperty("TransportationDetailsViewProps/BusyIndicator", false);
                    }
                });
            },
            initODataErrorHandler: function() {
				this.getModel().attachMessageChange(null, (oEvent) => {
                    oEvent.getParameter("newMessages")
                        .forEach((oMessage) => oMessage.technical = false)
						.forEach((oMessage) => sap.ui.getCore().getMessageManager().addMessages(oMessage));
                });
            },

			/**
			 * The component is destroyed by UI5 automatically.
			 * In this method, the ListSelector and ErrorHandler are destroyed.
			 * @public
			 * @override
			 */
			destroy : function () {
				this.oListSelector.destroy();
				this._oErrorHandler.destroy();
				// call the base component's destroy function
				UIComponent.prototype.destroy.apply(this, arguments);
			},

			/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
			 * design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
			 */
			getContentDensityClass : function() {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			}

		});

	}
);