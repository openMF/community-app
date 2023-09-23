(function (module) {
    mifosX.services = _.extend(module, {

        UIConfigService: function ($q,$http,$templateCache) {
            this.appendConfigToScope = function(scope){
                var jsonData = $templateCache.get("configJsonObj");
                if(jsonData != null && jsonData != ""){
                    jsonData.then(function(data) {
                        if(data != '' && data != null && data != 'undefined'){
                            if(data.enableUIDisplayConfiguration != null && data.enableUIDisplayConfiguration == true){
                                scope.response = data;
                            }
                        }
                    })
                }
            };

            this.init  = function(scope) {
                var deferred = $q.defer();
                $http.get('scripts/config/UIconfig.json').then(function onSuccess(response) {
                    var data = response.data;
                    scope.$emit("configJsonObj",data);
                    deferred.resolve(data);
                    $templateCache.put("configJsonObj", deferred.promise);
                }).catch(function onError(errorResponse){
                    deferred.reject(errorResponse.data);
                });

            };
        }



    });

    mifosX.ng.services.service('UIConfigService', ['$q','$http','$templateCache',mifosX.services.UIConfigService]).run(function ($log) {
        $log.info("UIConfigService initialized");

    });

}(mifosX.services || {}));
