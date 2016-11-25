(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSavingChargeController: function (scope, resourceFactory, routeParams, location, $uibModal) {

            scope.savingId = routeParams.savingId;
            scope.chargeId = routeParams.id;

            resourceFactory.savingsResource.get({ resourceType: 'charges', accountId: scope.savingId, chargeId: scope.chargeId}, function (data) {
                scope.charge = data;
                if (routeParams.status == 'Submitted and pending approval') {
                    scope.showEditButtons = true;
                }
                if (routeParams.status == 'Active') {
                    scope.showWaiveButton = true;
                    if(scope.charge.amountOutstanding == 0){
                        scope.showWaiveButton = false;
                    }
                }
                if (scope.showWaiveButton) {
                    scope.isRecurringCharge = scope.charge.chargeTimeType.value == 'Monthly Fee'
                        || scope.charge.chargeTimeType.value == 'Annual Fee'
                        || scope.charge.chargeTimeType.value == 'Weekly Fee';
                }

            });
            scope.deleteCharge = function () {
                $uibModal.open({
                    templateUrl: 'deletecharge.html',
                    controller: ChargeDeleteCtrl
                });
            };
            var ChargeDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.savingsResource.delete({ resourceType: 'charges', accountId: scope.savingId, chargeId: scope.chargeId}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/viewsavingaccount/' + scope.savingId);
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.waiveCharge = function () {
                resourceFactory.savingsResource.save({ resourceType: 'charges', accountId: scope.savingId, chargeId: scope.chargeId}, {}, function (data) {
                    location.path('/viewsavingaccount/' + scope.savingId);
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewSavingChargeController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewSavingChargeController]).run(function ($log) {
        $log.info("ViewSavingChargeController initialized");
    });
}(mifosX.controllers || {}));
