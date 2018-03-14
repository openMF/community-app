(function (module) {
    mifosX.controllers = _.extend(module, {
        GlobalConfigurationController: function (scope, resourceFactory, location, route) {
            scope.configs = [];
            scope.GlobalsPerPage = 15;
            resourceFactory.configurationResource.get(function (data) {
                for (var i in data.globalConfiguration) {
                    data.globalConfiguration[i].showEditvalue = true;
                    scope.configs.push(data.globalConfiguration[i])
                }
                resourceFactory.cacheResource.get(function (data) {
                    for (var i in data) {
                        if (data[i].cacheType && data[i].cacheType.id == 2) {
                            var cache = {};
                            cache.name = 'Is Cache Enabled';
                            cache.enabled = data[i].enabled;
                            cache.showEditvalue = false;
                            scope.configs.push(cache);
                        }
                    }

                });
            });

            if (!scope.searchCriteria.config) {
                scope.searchCriteria.config = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.config || '';

            scope.onFilter = function () {
                scope.searchCriteria.config = scope.filterText;
                scope.saveSC();
            };

            scope.enable = function (id, name) {
                if (name == 'Is Cache Enabled') {
                    var temp = {};
                    temp.cacheType = 2;
                    resourceFactory.cacheResource.update(temp, function (data) {
                        route.reload();
                    });
                }
                else {
                    var temp = {'enabled': 'true'};
                    resourceFactory.configurationResource.update({'id': id}, temp, function (data) {
                        route.reload();
                    });
                }
            };
            scope.disable = function (id, name) {
                if (name == 'Is Cache Enabled') {
                    var temp = {};
                    temp.cacheType = 1;
                    resourceFactory.cacheResource.update(temp, function (data) {
                        route.reload();
                    });
                }
                else {
                    var temp = {'enabled': 'false'};
                    resourceFactory.configurationResource.update({'id': id}, temp, function (data) {
                        route.reload();
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('GlobalConfigurationController', ['$scope', 'ResourceFactory', '$location', '$route', mifosX.controllers.GlobalConfigurationController]).run(function ($log) {
        $log.info("GlobalConfigurationController initialized");
    });
}(mifosX.controllers || {}));