(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanCollateralDataController: function (scope, resourceFactory, routeParams, location, $uibModal) {

            scope.loanId = routeParams.id;
            scope.collateralId = routeParams.collateralId;
            //scope.showEditButtons = routeParams.status == 'Submitted and pending approval' ? true : false;
            resourceFactory.loancollateralResource.get({collateralId: scope.collateralId}, function (data) {
                scope.collateral = data;
            });
            // scope.deleteCollateral = function () {
            //     $uibModal.open({
            //         templateUrl: 'deletecollateral.html',
            //         controller: CollateralDeleteCtrl
            //     });
            // };
            // var CollateralDeleteCtrl = function ($scope, $uibModalInstance) {
            //     $scope.delete = function () {
            //         resourceFactory.loanResource.delete({ resourceType: 'collaterals', loanId: scope.loanId, resourceId: scope.collateralId}, {}, function (data) {
            //             $uibModalInstance.close('delete');
            //             location.path('/viewloanaccount/' + scope.loanId);
            //         });
            //     };
            //     $scope.cancel = function () {
            //         $uibModalInstance.dismiss('cancel');
            //     };
            // };
        }
    });
    mifosX.ng.application.controller('ViewLoanCollateralDataController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewLoanCollateralDataController]).run(function ($log) {
        $log.info("ViewLoanCollateralDataController initialized");
    });
}(mifosX.controllers || {}));
