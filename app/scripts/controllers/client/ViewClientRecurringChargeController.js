(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewClientRecurringChargeController: function (scope, resourceFactory, location, routeParams, route) {
            scope.clientId = routeParams.clientId;

            resourceFactory.clientRecurringChargesResource.getRecurringCharge({
                clientId: routeParams.clientId,
                resourceType: routeParams.recurringChargeId
            }, function (data) {
                scope.recurringcharge = data;
            });

            scope.deleteRecurringCharge = function () {
                resourceFactory.clientRecurringChargesResource.inactivateRecurringCharge({
                    clientId: routeParams.clientId,
                    resourceType: routeParams.recurringChargeId
                }, function (data) {
                    location.path('/viewclient/' + scope.clientId+'/chargeoverview');
                });
            }
        }
    });
    mifosX.ng.application.controller('ViewClientRecurringChargeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', '$route', mifosX.controllers.ViewClientRecurringChargeController]).run(function ($log) {
        $log.info("ViewClientRecurringChargeController initialized");
    });
}(mifosX.controllers || {}));
