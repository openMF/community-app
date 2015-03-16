(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCashierController: function (scope, routeParams, route, location, resourceFactory) {
            resourceFactory.tellerCashierResource.getCashier({tellerId: routeParams.tellerId, cashierId:routeParams.cashierId}, function (data) {
                scope.cashier = data;
            });
        }

    });

    mifosX.ng.application.controller('ViewCashierController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewCashierController]).run(function ($log) {
        $log.info("ViewCashierController initialized");
    });
}(mifosX.controllers || {}));
