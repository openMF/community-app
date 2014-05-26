(function (module) {
    mifosX.filters = _.extend(module, {
        prettifyDataTableColumn: function () {
            var prettifyColumnName = function (input, split) {
                var temp = input.split(split);
                if (temp[1] && temp[1] != "") {
                    return temp[1];
                } else {
                    return temp[0];
                }
            }

            return function (input) {
                var retVal;
                if (input.indexOf("_cd_") > 0) {
                    retVal = prettifyColumnName(input, "_cd_");
                } else if (input.indexOf("_cv_") > 0) {
                    retVal = prettifyColumnName(input, "_cv_");
                } else if (input.indexOf("_cd") > 0) {
                    retVal = prettifyColumnName(input, "_cd");
                } else if (input.indexOf("_cv") > 0) {
                    retVal = prettifyColumnName(input, "_cv");
                } else {
                    retVal = input;
                }
                return retVal;
            }
        }
    });
    mifosX.ng.application.filter('prettifyDataTableColumn', ['dateFilter', mifosX.filters.prettifyDataTableColumn]).run(function ($log) {
        $log.info("PrettifyDataTableColumn filter initialized");
    });
}(mifosX.filters || {}));
