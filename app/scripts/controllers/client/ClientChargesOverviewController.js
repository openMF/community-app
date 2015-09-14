(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientChargesOverviewController: function (scope, resourceFactory, location, routeParams,route) {
            scope.clientId = routeParams.id
            scope.charges = [];
            scope.chargesPerPage = 14;

            scope.routeToCharge = function (chargeId) {
                location.path('/viewclient/' + scope.clientId + '/charges/' + chargeId);
            };

            scope.getClientChargeResultsPage = function (pageNumber) {
                var items = resourceFactory.clientChargesResource.getCharges({
                    clientId: routeParams.id,
                    offset: ((pageNumber - 1) * scope.chargesPerPage),
                    limit: scope.chargesPerPage
                }, function (data) {
                    scope.totalCharges= data.totalFilteredRecords;
                    scope.charges = data.pageItems;
                });
            }

            scope.getClientChargeResultsPage(1);

            resourceFactory.clientRecurringChargesResource.getRecurringCharges({clientId: routeParams.id}, function (data) {
                scope.recurringCharges = data;
            });
            scope.inactivateCharge = function(recurringChargeId){
                resourceFactory.clientRecurringChargesResource.inactivate({clientId: routeParams.id, resourceType:recurringChargeId}, function (data) {
                    route.reload();
                });
            }

            scope.activateCharge = function(recurringChargeId){
                resourceFactory.clientRecurringChargesResource.activate({clientId: routeParams.id, resourceType:recurringChargeId}, function (data) {
                    route.reload();
                });
            }


        }
    });
    mifosX.ng.application.controller('ClientChargesOverviewController', ['$scope', 'ResourceFactory', '$location', '$routeParams','$route', mifosX.controllers.ClientChargesOverviewController]).run(function ($log) {
        $log.info("ClientChargesOverviewController initialized");
    });
}(mifosX.controllers || {}));
