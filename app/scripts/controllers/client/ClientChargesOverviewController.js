(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientChargesOverviewController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.clientId =  routeParams.id

            resourceFactory.clientChargesResource.getCharges({clientId: routeParams.id}, function (data) {
                scope.charges = data;
            });

            resourceFactory.clientTransactionResource.getTransactions({clientId: routeParams.id}, function (data) {
                scope.transactions = data;
            });

            scope.routeToCharge = function (chargeId) {
                location.path('/viewclient/'+ scope.clientId + '/charges/' + chargeId);
            };
        }
    });
    mifosX.ng.application.controller('ClientChargesOverviewController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ClientChargesOverviewController]).run(function ($log) {
        $log.info("ClientChargesOverviewController initialized");
    });
}(mifosX.controllers || {}));
