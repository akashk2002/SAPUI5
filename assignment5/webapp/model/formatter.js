sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(DateFormat) {
    "use strict";

    return {

        formatDate: function(date) {
            if (!date) {
                return "";
            }

            
            var oDateFormat = DateFormat.getDateInstance({ style: "long" });
            return oDateFormat.format(date);
        }

    };
});