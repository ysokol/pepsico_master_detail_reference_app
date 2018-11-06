/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessagePopover",
    "sap/m/MessageItem",
], function(Controller, History, MessagePopover, MessageItem) {
	"use strict";

	return Controller.extend("com.pepsico.dev.reference.masterDetailTransactional.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},

		getTransportationService: function() {
			return this.getOwnerComponent().oTransportationService;
		},

        getServiceFactory: function() {
            return this.getOwnerComponent().oServiceFactory;
        },

		/*getDialog: function(sDialogName) {
			this._oDialogs = this._oDialogs || {};
			if (!this._oDialogs[sDialogName]) {
				this._oDialogs[sDialogName] = sap.ui.xmlfragment(this.getView().getId(),
					"com.pepsico.dev.reference.masterDetailTransactional.view.fragment." + sDialogName, this);
				this.getView().addDependent(this._oDialogs[sDialogName]);
				this._oDialogs[sDialogName].addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			return this._oDialogs[sDialogName];
		},*/

		getFragment: function(sFragmentName) {
            this._mFragments = this._mFragments || new Map();
            if (!this._mFragments.has(sFragmentName)) {
                let oNewFragment = sap.ui.xmlfragment(this.getView().getId(),
                    "com.pepsico.dev.reference.masterDetailTransactional.view.fragment." + sFragmentName, this);
                this.getView().addDependent(oNewFragment);
                oNewFragment.addStyleClass(this.getOwnerComponent().getContentDensityClass());
                this._mFragments.set(sFragmentName, oNewFragment);
            }
            return this._mFragments.get(sFragmentName);
		},

		removeAllMessages: function() {
            sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		getMessagePopover: function() {
            if (this._oMessagePopover) {
            	return this._oMessagePopover;
            }
			this._oMessagePopover = new MessagePopover({
                items: {
                    path: "/",
                    template: new MessageItem({
                        description: "{description}",
                        type: "{type}",
                        title: "{message}",
                        subtitle: '{subtitle}',
                        counter: '{counter}',
                    })
                }
            });
            this._oMessagePopover.setModel(this.getOwnerComponent().getModel("messageLog"));
            return this._oMessagePopover;
		},

        onToggleMessagePopover: function(oEvent) {
            this.getMessagePopover().toggle(oEvent.getSource());
        },

		getI18nText(sKey, aArgs) {
            return this.getModel("i18n").getResourceBundle().getText(sKey, aArgs);
		}

	});

});