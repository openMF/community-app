(function(module) {
    mifosX.controllers = _.extend(module, {
        GlobalConfigurationController: function(scope, resourceFactory , location,route) {
            scope.configs = [];
            resourceFactory.configurationResource.get(function(data) {
              scope.configs = data.globalConfiguration;
            });
            scope.enable = function(name) {
                var configId = name + "=" + "true" ;
                resourceFactory.configurationUpdateResource.update({configId : configId},'',function(data) {
                    route.reload();
                });
            };
            scope.disable = function(name) {
                var configId = name + "=" + "false" ;
                resourceFactory.configurationUpdateResource.update({configId: configId},'',function(data) {
                    resourceFactory.configurationResource.get(function(data) {
                        route.reload();
                    });
                });
            };

        }
    });
    mifosX.ng.application.controller('GlobalConfigurationController', ['$scope', 'ResourceFactory', '$location','$route', mifosX.controllers.GlobalConfigurationController]).run(function($log) {
        $log.info("GlobalConfigurationController initialized");
    });
}(mifosX.controllers || {}));
