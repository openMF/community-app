(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAllClientCollateralController: function (scope, resourceFactory, routeParams, location) {
            scope.clientId = routeParams.id;
            console.log(routeParams)
            scope.routeTo = function (id) {
                location.path('/clients/' + routeParams.id + '/viewclientcollateral/' + id);
            };

            // if (!scope.searchCriteria.collaterals) {
            //     scope.searchCriteria.collaterals = null;
            //     scope.saveSC();
            // }
            //scope.filterText = scope.searchCriteria.charges || '';

            // scope.onFilter = function () {
            //     scope.searchCriteria.charges = scope.filterText;
            //     scope.saveSC();
            // };

            scope.CollateralPerPage =15;
            //scope.$broadcast('CollateralDataLoadingStartEvent');
            resourceFactory.clientcollateralResource.getAllCollaterals({clientId: scope.clientId}, function (data) {
                console.log(data)
                scope.collaterals = data;
                //scope.$broadcast('CollateralDataLoadingCompleteEvent');
            });
        }
    });
    mifosX.ng.application.controller('ViewAllClientCollateralController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ViewAllClientCollateralController]).run(function ($log) {
        $log.info("ViewAllClientCollateralController initialized");
    });
}(mifosX.controllers || {}));