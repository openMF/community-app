(function (module) {
    mifosX.filters = _.extend(module, {
        DotRemove: function () {
            return function (input) {
                if (input) {
                    var exp = input;
                    var alpha = '';
                    for (var i = 0; i < exp.length; i++) {
                        if (exp[i] != '.') {
                            alpha = alpha + exp[i];
                        }
                    }
                    return alpha;
                }
            }
        }
    });
    mifosX.ng.application.filter('DotRemove', ['dateFilter', mifosX.filters.DotRemove]).run(function ($log) {
        $log.info("DotRemove filter initialized");
    });
}(mifosX.filters || {}));
