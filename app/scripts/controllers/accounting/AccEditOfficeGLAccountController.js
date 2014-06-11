(function (module) {
    mifosX.controllers = _.extend(module, {
        AccEditOfficeGLAccountController: function (scope, resourceFactory, location,routeParams) {
            scope.liabilityOptions = [];
            scope.officeOptions = [];
            scope.formData = {};
            resourceFactory.officeToGLAccountMappingResource.withTemplate({mappingId: routeParams.mappingId},function (data) {
                scope.mapping = data;
                scope.liabilityOptions = data.accountingMappingOptions.liabilityAccountOptions || [];
                scope.formData.liabilityTransferInSuspenseAccountId = data.glAccountData.id;
            });


            scope.submit = function () {
                resourceFactory.officeToGLAccountMappingResource.update({mappingId: routeParams.mappingId},this.formData, function (data) {
                    location.path('/viewofficeglmapping/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('AccEditOfficeGLAccountController', ['$scope', 'ResourceFactory', '$location','$routeParams', mifosX.controllers.AccEditOfficeGLAccountController]).run(function ($log) {
        $log.info("AccEditOfficeGLAccountController initialized");
    });
}(mifosX.controllers || {}));
