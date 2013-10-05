(function(module) {
    mifosX.controllers = _.extend(module, {
        GlobalConfigurationController: function(scope, resourceFactory , location,route) {
            scope.configs = [];
            resourceFactory.configurationResource.get(function(data) {
                for(var i in data.globalConfiguration){
                    scope.configs.push(data.globalConfiguration[i])
                }
                resourceFactory.cacheResource.get(function(data) {
                    for(var i in data ){
                        if(data[i].cacheType.id==2){
                            var cache = {};
                            cache.name = 'Is Cache Enabled';
                            cache.enabled =  data[i].enabled;
                        }
                    }
                    scope.configs.push(cache);
                });
            });

            scope.enable = function(name) {
                if(name=='Is Cache Enabled'){
                    var temp = {};
                    temp.cacheType = 2;
                    resourceFactory.cacheResource.update(temp,function(data) {
                     route.reload();
                    });
                }
                else
                {
                var temp = {};
                temp[name] = 'true';
                resourceFactory.configurationResource.update(temp,'',function(data) {
                    route.reload();
                });
                }
            };
            scope.disable = function(name) {
                if(name=='Is Cache Enabled'){
                    var temp = {};
                    temp.cacheType = 1;
                    resourceFactory.cacheResource.update(temp,function(data) {
                        route.reload();
                    });
                }
                else
                {
                var temp = {};
                temp[name] = 'false';
                resourceFactory.configurationResource.update(temp,'',function(data) {
                    route.reload();
                });
                }
            };

        }
    });
    mifosX.ng.application.controller('GlobalConfigurationController', ['$scope', 'ResourceFactory', '$location','$route', mifosX.controllers.GlobalConfigurationController]).run(function($log) {
        $log.info("GlobalConfigurationController initialized");
    });
}(mifosX.controllers || {}));
