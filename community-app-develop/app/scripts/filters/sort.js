(function (module) {
    mifosX.filters = _.extend(module, {
        sort: function () {
            return function (input) {
                return input.sort();
            }
        }
    });
    mifosX.ng.application.filter('sort', ['dateFilter', mifosX.filters.sort]).run(function ($log) {
        $log.info("sort filter initialized");
    });
}(mifosX.filters || {}));
