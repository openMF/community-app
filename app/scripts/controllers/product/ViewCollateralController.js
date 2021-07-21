(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCollateralController: function (scope, resourceFactory, routeParams, location, $uibModal) {

            scope.collateralId = routeParams.id;
            resourceFactory.collateralResource.get({collateralId: scope.collateralId}, function (data) {
                scope.collateral = data;
            });

            scope.deleteCollateral = function () {
                $uibModal.open({
                    templateUrl: 'deletecollateralprod.html',
                    controller: CollateralDeleteCtrl
                });
            };

            var CollateralDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.collateralResource.delete({collateralId: scope.collateralId}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/viewcollateral/' + scope.collateralId);
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewCollateralController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewCollateralController]).run(function ($log) {
        $log.info("ViewCollateralController initialized");
    });
}(mifosX.controllers || {}));
