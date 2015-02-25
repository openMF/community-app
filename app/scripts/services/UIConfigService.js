(function (module) {
    mifosX.services = _.extend(module, {

        UIConfigService: function ($q,$http,$templateCache) {
            this.appendConfigToScope = function(scope){

                var jsonData = $templateCache.get("configJsonObj");
                jsonData.then(function(data) {
                    if(data != '' && data != null && data != 'undefined'){
                        if(data.enableUIDisplayConfiguration != null && data.enableUIDisplayConfiguration == true){
                            scope.response = data;
                        }
                    }
                })

            };

            this.init  = function() {
                var deferred = $q.defer();
                $http.get('scripts/modules/UIconfig.json').success(function(data) {
                    deferred.resolve(data);
                }).error(function(data) {
                    deferred.reject(data);
                }).catch(function(e){
                    console.log("Configuration file not found");
                });
                $templateCache.put("configJsonObj", deferred.promise);

            };
        }



    });

    mifosX.ng.services.service('UIConfigService', ['$q','$http','$templateCache',mifosX.services.UIConfigService]).run(function ($log) {
        $log.info("UIConfigService initialized");

    });

}(mifosX.services || {}));
