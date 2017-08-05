(function (module) {
    mifosX.controllers = _.extend(module, {
    	AdHocQueryController: function (scope, resourceFactory, location) {
            scope.adhocquery = [];
            scope.routeTo = function (id) {
                location.path('/viewadhocquery/' + id);
            };
            resourceFactory.adHocQueryResource.getAllAdHocQuery({}, function (data) {
                scope.adhocquery = data;
            });

            scope.isActive= function(value) {
                return value;
            };
        }
    });
    mifosX.ng.application.controller('AdHocQueryController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AdHocQueryController]).run(function ($log) {
        $log.info("AdHocQueryController initialized");
    });
}(mifosX.controllers || {}));
