(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewChargeController: function (scope, routeParams, resourceFactory, location, $uibModal) {
            scope.charge = [];
            scope.choice = 0;
            resourceFactory.chargeResource.get({chargeId: routeParams.id}, function (data) {
                scope.charge = data;
            });

            scope.deleteCharge = function () {
                $uibModal.open({
                    templateUrl: 'deletech.html',
                    controller: ChDeleteCtrl
                });
            };
            var ChDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.chargeResource.delete({chargeId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/charges');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewChargeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewChargeController]).run(function ($log) {
        $log.info("ViewChargeController initialized");
    });
}(mifosX.controllers || {}));
