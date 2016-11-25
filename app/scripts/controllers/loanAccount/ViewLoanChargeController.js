(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanChargeController: function (scope, resourceFactory, routeParams, location, $uibModal) {

            scope.loanId = routeParams.loanId;
            scope.chargeId = routeParams.id;
            if (routeParams.loanstatus == 'Submitted and pending approval') {
                scope.showEditButtons = true;
            }
            if (routeParams.loanstatus == 'Active') {
                scope.showWaiveButton = true;
            }
            resourceFactory.loanResource.get({ resourceType: 'charges', loanId: scope.loanId, resourceId: scope.chargeId}, function (data) {
                scope.charge = data;
            });
            scope.deleteCharge = function () {
                $uibModal.open({
                    templateUrl: 'deletecharge.html',
                    controller: ChargeDeleteCtrl
                });
            };
            var ChargeDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.loanResource.delete({ resourceType: 'charges', loanId: scope.loanId, resourceId: scope.chargeId}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/viewloanaccount/' + scope.loanId);
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.waiveCharge = function () {
                resourceFactory.loanResource.save({ resourceType: 'charges', loanId: scope.loanId, resourceId: scope.chargeId}, {}, function (data) {
                    location.path('/viewloanaccount/' + scope.loanId);
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewLoanChargeController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewLoanChargeController]).run(function ($log) {
        $log.info("ViewLoanChargeController initialized");
    });
}(mifosX.controllers || {}));
