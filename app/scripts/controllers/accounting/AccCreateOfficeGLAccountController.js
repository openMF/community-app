(function (module) {
    mifosX.controllers = _.extend(module, {
        AccCreateOfficeGLAccountController: function (scope, resourceFactory, location) {
            scope.liabilityOptions = [];
            scope.officeOptions = [];

            resourceFactory.officeToGLAccountMappingTemplateResource.get(function (data) {
                scope.liabilityOptions = data.accountingMappingOptions.liabilityAccountOptions || [];
                scope.officeOptions = data.officeOptions || [];

            });


            scope.submit = function () {
                resourceFactory.officeToGLAccountMappingResource.create(this.formData, function (data) {
                    location.path('/viewofficeglmapping/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('AccCreateOfficeGLAccountController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AccCreateOfficeGLAccountController]).run(function ($log) {
        $log.info("AccCreateOfficeGLAccountController initialized");
    });
}(mifosX.controllers || {}));
