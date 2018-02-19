(function (module) {
    mifosX.controllers = _.extend(module, {
        AdHocQueryListController: function (scope, resourceFactory, location) {
            scope.adhocquerys = [];

            scope.routeTo = function (id) {
                location.path('/viewadhocquery/' + id);
            };
            
            resourceFactory.adHocQueryResource.getAllAdHocQuery(function (data) {
                scope.adhocquerys = data;

                for (var j = 0; j < data.length; j+= 1) {
                    var d = data[j];
                    for (var i = 0; i < d.reportRunFrequencies.length; i+= 1) {
                        if (d.reportRunFrequency === d.reportRunFrequencies[i].id) {
                            d.reportRunFrequency = d.reportRunFrequencies[i].code;
                            break;
                        }
                    }
                }
            });
        }
    });
    mifosX.ng.application.controller('AdHocQueryListController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AdHocQueryListController]).run(function ($log) {
        $log.info("AdHocQueryListController initialized");
    });
}(mifosX.controllers || {}));