sap.ui.define([
    'sap/ui/base/Object',
    'com/pepsico/core/sap/ui/model/odata/v2/ODataModelExtensions',
    'com/pepsico/core/sap/ui/model/json/JSONModelExtensions',
    "com/pepsico/dev/reference/masterDetailTransactional/model/models"
], function (Object, ODataModelExtensions, JSONModelExtensions, models) {
    'use strict';
    return Object.extend('com.pepsico.dev.reference.masterDetailTransactional.model.TransportationItemService', {
        constructor: function ({
                                   oTransportationRepository = undefined,
                                   oTransportationViewModel = undefined,
	                               oTransportationCalculateTotals = undefined,
	                               oI18nModel = undefined
                               } = {}) {
            Object.apply(this);
            this._oTransportationViewModel = oTransportationViewModel;
            this._oTranportationRepository = oTransportationRepository;
	        this._oTransportationCalculateTotals = oTransportationCalculateTotals;
	        this._oI18nModel = oI18nModel;
            this._oMessageManager = sap.ui.getCore().getMessageManager();
        },
        init: function () {
        },
        onMaterialChanged(sPath) {
            this._oTransportationViewModel.setProperty(sPath + "Description",
                this._oTransportationViewModel.getProperty(sPath + "MaterialDetails/Description"))
        },
        clearCreateTransportationItemProps: function () {
            this._oTransportationViewModel.setProperty("/NewTransportationItemDetails",
                models.createTransportationItemDetails());
        },
        initCreateTransportationItemProps: function () {
            this.clearCreateTransportationItemProps();
            this._oTransportationViewModel.setProperty("/NewTransportationItemDetails/ItemNum",
                this._getNextTransportationItemNum());
        },
        validateNewTransportationItem: function() {
        	return this.validateTransportationItem("/NewTransportationItemDetails");
        },
	    validateTransportationItem: function(sPath) {
		    let bValidationResult = true;
		    if (this._oTransportationViewModel.getProperty(sPath + "/ItemNum") === undefined) {
		    	throw new Error(`Invalid path: '${sPath}'`);
		    }
		    if (this._oTransportationViewModel.getProperty(sPath + "/Quantity") == 0) {
			    this._oMessageManager.addMessages(
				    new sap.ui.core.message.Message({
					    id: sPath + "/quantityShouldNotBeZero",
					    message: this._getI18nText("quantityShouldNotBeZero"),
					    type: sap.ui.core.MessageType.Error,
					    target: sPath + "/Quantity",
					    processor: this._oTransportationViewModel,
				    })
			    );
			    bValidationResult = false;
		    }
		    if (this._oTransportationViewModel.getProperty(sPath + "/Description") === "") {
			    this._oMessageManager.addMessages(
				    new sap.ui.core.message.Message({
					    id: sPath + "/descriptionShouldNotBeEmpty",
					    message: this._getI18nText("descriptionShouldNotBeEmpty"),
					    type: sap.ui.core.MessageType.Error,
					    target: sPath + "/Description",
					    processor: this._oTransportationViewModel,
				    })
			    );
			    bValidationResult = false;
		    }
		    if (this._oTransportationViewModel.getProperty(sPath + "/Material") === "") {
			    this._oMessageManager.addMessages(
				    new sap.ui.core.message.Message({
					    id: sPath + "/materialShouldNotBeEmpty",
					    message: this._getI18nText("materialShouldNotBeEmpty"),
					    type: sap.ui.core.MessageType.Error,
					    target: sPath + "/Material",
					    processor: this._oTransportationViewModel,
				    })
			    );
			    bValidationResult = false;
		    }
		    if (!bValidationResult) {
			    this._oTransportationViewModel.setProperty(sPath + "/_ErrorStatus", "Error");
		    } else {
			    this._oTransportationViewModel.setProperty(sPath + "/_ErrorStatus", "");
		    }
 		    return bValidationResult;
	    },
        resetTransportationItemChanges: function(sPath) {
        },
        createTransportationItem: function() {
            return new Promise((fnResolve, fnReject) => {
                this._oTranportationRepository.createTransportationItem(
                    this._oTransportationViewModel.getProperty("/TransportationDetails/__metadata/localODataPath"),
                    this._oTransportationViewModel.getProperty("/NewTransportationItemDetails")
                )
                    .then((oNewTransportationItem) => {
                        let aItems = this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems");
                        aItems.push(oNewTransportationItem);
                        this.clearCreateTransportationItemProps();
	                    this._oTransportationCalculateTotals.recalculateTotals();
	                    this._oTransportationCalculateTotals.recalculatePrice();
                        fnResolve(oNewTransportationItem);
                    });

            });

        },
        deleteTransportationItem: function(sPath) {
            return new Promise((fnResolve, fnReject) => {
                this._oTranportationRepository.deleteTransportationItem(sPath)
                    .then(() => {
                        let aItems = this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems");
                        aItems = aItems.filter(oItem => oItem.__metadata.localODataPath !== sPath);
                        this._oTransportationViewModel.setProperty("/TransportationDetails/TransportationItems", aItems);
	                    this._oTransportationCalculateTotals.recalculateTotals();
	                    this._oTransportationCalculateTotals.recalculatePrice();
                        fnResolve();
                    });
            });
        },
        _getNextTransportationItemNum: function () {
            const aItems = this._oTransportationViewModel.getProperty("/TransportationDetails/TransportationItems");
            return this._formatWithLeadingZero(
                parseInt(aItems.reduce((sMaxNum, oCurrentItem) =>
                        (sMaxNum < oCurrentItem.ItemNum) ? oCurrentItem.ItemNum : sMaxNum,
                    "00000")) + 10,
                5);
        },
        _formatWithLeadingZero: function (iNumber, iLeadingZeroCount) {
            return (1e15 + iNumber + "").slice(-iLeadingZeroCount);
        },
	    _getI18nText: function(sKey, aArgs) {
		    return this._oI18nModel.getResourceBundle().getText(sKey, aArgs);
	    },
    });
});