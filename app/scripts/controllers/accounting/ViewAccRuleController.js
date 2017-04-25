(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAccRuleController: function (scope, resourceFactory, routeParams, location, $uibModal) {

            resourceFactory.accountingRulesResource.getById({accountingRuleId: routeParams.id}, function (data) {
                scope.rule = data;
            });
            scope.deleteRule = function () {
                $uibModal.open({
                    templateUrl: 'deleteaccrule.html',
                    controller: AccRuleDeleteCtrl
                });
            };
            var AccRuleDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.accountingRulesResource.delete({accountingRuleId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/accounting_rules');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewAccRuleController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewAccRuleController]).run(function ($log) {
        $log.info("ViewAccRuleController initialized");
    });
}(mifosX.controllers || {}));