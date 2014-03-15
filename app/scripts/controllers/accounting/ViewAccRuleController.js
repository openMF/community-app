(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAccRuleController: function (scope, resourceFactory, routeParams, location, $modal) {

            resourceFactory.accountingRulesResource.getById({accountingRuleId: routeParams.id}, function (data) {
                scope.rule = data;
            });
            scope.deleteRule = function () {
                $modal.open({
                    templateUrl: 'deleteaccrule.html',
                    controller: AccRuleDeleteCtrl
                });
            };
            var AccRuleDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.accountingRulesResource.delete({accountingRuleId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/accounting_rules');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewAccRuleController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$modal', mifosX.controllers.ViewAccRuleController]).run(function ($log) {
        $log.info("ViewAccRuleController initialized");
    });
}(mifosX.controllers || {}));