(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewChargeController: function (scope, routeParams, resourceFactory, location, $uibModal) {
            scope.charge = [];
            scope.choice = 0;
            resourceFactory.chargeResource.get({chargeId: routeParams.id}, function (data) {
                scope.charge = data;

                resourceFactory.loanProductResource.get({resourceType: 'template'}, function (data) {
                    scope.product = data;
                    scope.paymentTypeOptions = data.paymentTypeOptions;
                    const repaymentFrequency = 1;
                    scope.filteredItems = scope.product.repaymentFrequencyTypeOptions.slice(0, repaymentFrequency).concat(scope.product.repaymentFrequencyTypeOptions.slice(repaymentFrequency + 1, scope.product.repaymentFrequencyTypeOptions.length));

                    var restartFrequencyId = scope.charge.restartFrequencyEnum;
                    scope.restartEnum = scope.charge.restartFrequencyEnum;

                    angular.forEach(scope.filteredItems, function(items, key){
                        if(items.id == restartFrequencyId){
                            scope.frequencyType = items.value;
                        }
                    });
                });
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
