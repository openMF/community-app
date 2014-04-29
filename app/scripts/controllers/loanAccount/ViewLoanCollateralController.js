(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanCollateralController: function (scope, resourceFactory, routeParams, location, $modal) {

            scope.loanId = routeParams.loanId;
            scope.collateralId = routeParams.id;
            scope.showEditButtons = routeParams.status == 'Submitted and pending approval' ? true : false;
            resourceFactory.loanResource.get({ resourceType: 'collaterals', loanId: scope.loanId, resourceId: scope.collateralId}, function (data) {
                scope.collateral = data;
            });
            scope.deleteCollateral = function () {
                $modal.open({
                    templateUrl: 'deletecollateral.html',
                    controller: CollateralDeleteCtrl
                });
            };
            var CollateralDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.loanResource.delete({ resourceType: 'collaterals', loanId: scope.loanId, resourceId: scope.collateralId}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/viewloanaccount/' + scope.loanId);
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewLoanCollateralController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$modal', mifosX.controllers.ViewLoanCollateralController]).run(function ($log) {
        $log.info("ViewLoanCollateralController initialized");
    });
}(mifosX.controllers || {}));
