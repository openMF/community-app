(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAccountingClosureController: function (scope, resourceFactory, location, routeParams, $modal) {
            scope.accountClosure = {};
            scope.choice = 0;
            resourceFactory.accountingClosureResource.getView({accId: routeParams.id}, function (data) {
                scope.accountClosure = data;
            });
            scope.deleteAcc = function () {
                $modal.open({
                    templateUrl: 'deleteacc.html',
                    controller: AccDeleteCtrl
                });
            };
            var AccDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.accountingClosureResource.delete({accId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/accounts_closure');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewAccountingClosureController', ['$scope', 'ResourceFactory', '$location', '$routeParams', '$modal', mifosX.controllers.ViewAccountingClosureController]).run(function ($log) {
        $log.info("ViewAccountingClosureController initialized");
    });
}(mifosX.controllers || {}));
