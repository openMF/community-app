(function (module) {
    mifosX.controllers = _.extend(module, {
        FinancialActivityMappingsController: function (scope, resourceFactory, location) {

            resourceFactory.officeToGLAccountMappingResource.getAll(function (data) {
                scope.mappings = data;
            });

            scope.routeTo = function (resourceId){
                location.path('/viewfinancialactivitymapping/' + resourceId);
            };
        }
    });
    mifosX.ng.application.controller('FinancialActivityMappingsController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.FinancialActivityMappingsController]).run(function ($log) {
        $log.info("FinancialActivityMappingsController initialized");
    });
}(mifosX.controllers || {}));
