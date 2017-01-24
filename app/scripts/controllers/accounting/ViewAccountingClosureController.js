(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAccountingClosureController: function (scope, resourceFactory, location, routeParams, $uibModal) {
            scope.accountClosure = {};
            scope.choice = 0;
            resourceFactory.accountingClosureResource.getView({accId: routeParams.id}, function (data) {
                scope.accountClosure = data;
            });
            scope.deleteAcc = function () {
                $uibModal.open({
                    templateUrl: 'deleteacc.html',
                    controller: AccDeleteCtrl
                });
            };
            var AccDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.accountingClosureResource.delete({accId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/accounts_closure');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewAccountingClosureController', ['$scope', 'ResourceFactory', '$location', '$routeParams', '$uibModal', mifosX.controllers.ViewAccountingClosureController]).run(function ($log) {
        $log.info("ViewAccountingClosureController initialized");
    });
}(mifosX.controllers || {}));
