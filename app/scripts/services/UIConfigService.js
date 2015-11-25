(function (module) {
    mifosX.services = _.extend(module, {

        UIConfigService: function ($q,$http) {

            this.init  = function(scope) {
                $http.get('scripts/config/UIconfig.json').success(function(data) {
                    if(data != '' && data != null && data != 'undefined'){
                        if(data.enableUIDisplayConfiguration != null && data.enableUIDisplayConfiguration == true){
                            scope.response = data;
                        }
                    }
                }).error(function(data) {
                    console.log("Configuration file not found");
                }).catch(function(e){
                    console.log("Configuration file not found");
                });

            };
        }



    });

    mifosX.ng.services.service('UIConfigService', ['$q','$http',mifosX.services.UIConfigService]).run(function ($log) {
        $log.info("UIConfigService initialized");

    });

}(mifosX.services || {}));
