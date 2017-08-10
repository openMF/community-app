(function (module) {
    mifosX.controllers = _.extend(module, {
        AdHocQueryListController: function (scope, resourceFactory, location) {
            scope.adhocquerys = [];

            scope.routeTo = function (id) {
                location.path('/viewadhocquery/' + id);
            };
            
            resourceFactory.adHocQueryResource.getAllAdHocQuery(function (data) {
                scope.adhocquerys = data;
                //console.log(data);
            });
        }
    });
    mifosX.ng.application.controller('AdHocQueryListController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AdHocQueryListController]).run(function ($log) {
        $log.info("AdHocQueryListController initialized");
    });
}(mifosX.controllers || {}));