(function (module) {
    mifosX.filters = _.extend(module, {
        DateFormat: function (dateFilter, localStorageService) {
            return function (input) {
                if (input) {
                    // SAFARI is Bad We fix it
                    remove = input.toString().split(",");
                    var tDate = new Date(remove[0], remove[1]-1, remove[2]);
                    return dateFilter(tDate, localStorageService.getFromLocalStorage('dateformat'));
                }
                return '';
            }
        }
    });
    mifosX.ng.application.filter('DateFormat', ['dateFilter', 'localStorageService', mifosX.filters.DateFormat]).run(function ($log) {
        $log.info("DateFormat filter initialized");
    });
}(mifosX.filters || {}));
