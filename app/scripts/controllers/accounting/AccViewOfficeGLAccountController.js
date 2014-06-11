(function (module) {
    mifosX.controllers = _.extend(module, {
        AccViewOfficeGLAccountController: function (scope, resourceFactory, routeParams, location, $modal) {
            scope.liabilityOptions = [];
            scope.formData = {};
            resourceFactory.officeToGLAccountMappingResource.get({mappingId: routeParams.mappingId},function (data) {
                scope.mapping = data;
            });


            scope.deletemapping = function () {
                $modal.open({
                    templateUrl: 'deletemapping.html',
                    controller: AccRuleDeleteCtrl
                });
            };
            var AccRuleDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.officeToGLAccountMappingResource.delete({mappingId: routeParams.mappingId}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/listofficeglmapping');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('AccViewOfficeGLAccountController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$modal', mifosX.controllers.AccViewOfficeGLAccountController]).run(function ($log) {
        $log.info("AccViewOfficeGLAccountController initialized");
    });
}(mifosX.controllers || {}));
