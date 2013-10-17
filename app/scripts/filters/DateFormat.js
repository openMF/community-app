(function(module) {
    mifosX.filters = _.extend(module, {
        DateFormat: function (dateFilter) {
            return function(input) {
                if(input){
                    var tDateData =  input[0]+'/'+input[1]+'/'+input[2];
                    var tDate = new Date(tDateData);
                    return dateFilter(tDate,'dd MMMM yyyy');
                }
            }
        }
    });
    mifosX.ng.application.filter('DateFormat', ['dateFilter',mifosX.filters.DateFormat]).run(function($log) {
        $log.info("DateFormat filter initialized");
    });
}(mifosX.filters || {}));
