sap.ui.define([], function () {
        "use strict";
        let aTransportationStatuses = [{
            sStatus: "010.DRAFT",
            sIcon: "sap-icon://pending",
            sI18nTextKey: "draft",
            sState: sap.ui.core.ValueState.Warning
        }, {
            sStatus: "020.RELEASED",
            sIcon: "sap-icon://accept",
            sI18nTextKey: "released",
            sState: sap.ui.core.ValueState.Success
        }];
        return {
            transportationStatusIcon: function (sStatus) {
                return (aTransportationStatuses.find(oStatus => oStatus.sStatus === sStatus) || {}).sIcon;
            },
            transportationStatusState: function (sStatus) {
                return (aTransportationStatuses.find(oStatus => oStatus.sStatus === sStatus) || {}).sState;
            },
            transportationStatusText: function (sStatus) {
                return sap.ui.getCore().getLibraryResourceBundle("i18n").getText(
                    (aTransportationStatuses.find(oStatus => oStatus.sStatus === sStatus) || {}).sI18nTextKey);
            },
            /**
             * Rounds the currency value to 2 digits
             *
             * @public
             * @param {string} sValue value to be formatted
             * @returns {string} formatted currency value with 2 digits
             */
            currencyValue: function (sValue) {
                if (!sValue) {
                    return "";
                }

                return parseFloat(sValue).toFixed(2);
            }
        };

    }
);