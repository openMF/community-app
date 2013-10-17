(function(module) {
    mifosX.filters = _.extend(module, {
        DateFormat: function (dateFilter) {
            return function(input) {
                if(input){
                    var tDate = new Date(input);
                    return dateFilter(tDate,'dd MMMM yyyy');
                }

            }
        }
    });
    mifosX.ng.application.filter('DateFormat', ['dateFilter',mifosX.filters.DateFormat]).run(function($log) {
        $log.info("DateFormat filter initialized");
    });
}(mifosX.filters || {}));
