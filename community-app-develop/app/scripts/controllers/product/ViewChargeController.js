(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewChargeController: function (scope, routeParams, resourceFactory, location, $modal) {
            scope.charge = [];
            scope.choice = 0;
            resourceFactory.chargeResource.get({chargeId: routeParams.id}, function (data) {
                scope.charge = data;
            });

            scope.deleteCharge = function () {
                $modal.open({
                    templateUrl: 'deletech.html',
                    controller: ChDeleteCtrl
                });
            };
            var ChDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.chargeResource.delete({chargeId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/charges');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewChargeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', mifosX.controllers.ViewChargeController]).run(function ($log) {
        $log.info("ViewChargeController initialized");
    });
}(mifosX.controllers || {}));
