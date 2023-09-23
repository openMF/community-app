(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAllClientCollateralController: function (scope, resourceFactory, routeParams, location) {
            scope.clientId = routeParams.id;
            scope.routeTo = function (id) {
                location.path('/clients/' + routeParams.id + '/viewclientcollateral/' + id);
            };

            scope.CollateralPerPage = 15;
            resourceFactory.clientcollateralResource.getAllCollaterals({clientId: scope.clientId}, function (data) {
                scope.collaterals = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewAllClientCollateralController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ViewAllClientCollateralController]).run(function ($log) {
        $log.info("ViewAllClientCollateralController initialized");
    });
}(mifosX.controllers || {}));