(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewFinancialActivityController: function (scope, resourceFactory, routeParams, location, $uibModal) {
            resourceFactory.officeToGLAccountMappingResource.get({mappingId: routeParams.mappingId},function (data) {
                scope.mapping = data;
            });

            scope.deletemapping = function () {
                $uibModal.open({
                    templateUrl: 'deletemapping.html',
                    controller: AccRuleDeleteCtrl
                });
            };
            var AccRuleDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.officeToGLAccountMappingResource.delete({mappingId: routeParams.mappingId}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/financialactivityaccountmappings');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewFinancialActivityController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewFinancialActivityController]).run(function ($log) {
        $log.info("ViewFinancialActivityController initialized");
    });
}(mifosX.controllers || {}));
