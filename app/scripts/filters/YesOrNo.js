(function(module) {
    mifosX.filters = _.extend(module, {
        YesOrNo: function () {
            return function(input) {
                var status;
                if(input==true){
                    status = 'Yes';
                } else if(input==false){
                    status = 'No';
                }
                return status;
            }
        }
    });
    mifosX.ng.application.filter('YesOrNo', ['dateFilter',mifosX.filters.YesOrNo]).run(function($log) {
        $log.info("YesOrNo filter initialized");
    });
}(mifosX.filters || {}));
