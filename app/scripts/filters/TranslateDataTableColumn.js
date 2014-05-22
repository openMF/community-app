(function (module) {
    mifosX.filters = _.extend(module, {
        TranslateDataTableColumn: function () {
            return function (input) {
                var retVal;
                if (input.indexOf("_cd_") > 0) {
                    var temp = input.split("_cd_");
                    if (temp[1] && temp[1] != "") {
                        retVal = temp[1];
                    } else {
                        retVal = temp[0];
                    }
                } else if (input.indexOf("_cv_") > 0) {
                    var temp = input.split("_cv_");
                    if (temp[1] && temp[1] != "") {
                        retVal = temp[1];
                    } else {
                        retVal = temp[0];
                    }
                } else if (input.indexOf("_cd") > 0) {
                    var temp = input.split("_cd");
                    if (temp[1] && temp[1] != "") {
                        retVal = temp[1];
                    } else {
                        retVal = temp[0];
                    }
                } else if (input.indexOf("_cv") > 0) {
                    var temp = input.split("_cv");
                    if (temp[1] && temp[1] != "") {
                        retVal = temp[1];
                    } else {
                        retVal = temp[0];
                    }
                } else {
                    retVal = input;
                }
                return retVal;
            }
        }
    });
    mifosX.ng.application.filter('TranslateDataTableColumn', ['dateFilter', mifosX.filters.TranslateDataTableColumn]).run(function ($log) {
        $log.info("TranslateDataTableColumn filter initialized");
    });
}(mifosX.filters || {}));
