(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanCollateralDataController: function (scope, resourceFactory, routeParams, location, $uibModal) {

            scope.loanId = routeParams.id;
            scope.collateralId = routeParams.collateralId;
            resourceFactory.loancollateralResource.get({collateralId: scope.collateralId}, function (data) {
                scope.collateral = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewLoanCollateralDataController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewLoanCollateralDataController]).run(function ($log) {
        $log.info("ViewLoanCollateralDataController initialized");
    });
}(mifosX.controllers || {}));
