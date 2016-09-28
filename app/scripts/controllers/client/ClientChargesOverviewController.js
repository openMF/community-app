(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientChargesOverviewController: function (scope, resourceFactory, location, routeParams) {
            scope.clientId = routeParams.id
            scope.charges = [];
            scope.chargesPerPage = 14;
            scope.clientRecurringCharges=[];

            scope.routeToCharge = function (chargeId) {
                location.path('/viewclient/' + scope.clientId + '/charges/' + chargeId);
            };
            scope.routeToRecurringCharge = function (recurringChargeId) {
                location.path('/viewclient/' + scope.clientId + '/recurringcharges/' + recurringChargeId);
            };

                var items = resourceFactory.clientRecurringChargesResource.getRecurringCharges({
                    clientId:routeParams.id
                },function(data){
                    scope.clientRecurringCharges=data;
                })


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

        }
    });
    mifosX.ng.application.controller('ClientChargesOverviewController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.ClientChargesOverviewController]).run(function ($log) {
        $log.info("ClientChargesOverviewController initialized");
    });
}(mifosX.controllers || {}));
