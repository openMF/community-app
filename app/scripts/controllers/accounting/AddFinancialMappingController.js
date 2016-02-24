(function (module) {
    mifosX.controllers = _.extend(module, {
        AddFinancialMappingController: function (scope, resourceFactory, location) {
            scope.formData = {};

            resourceFactory.officeToGLAccountMappingResource.get({mappingId:'template'}, function (data) {
                scope.formData.financialActivityId = 100;
                scope.glAccountOptions = data.glAccountOptions;
                scope.financialActivityOptions = data.financialActivityOptions;
                scope.accountOptions = scope.glAccountOptions.assetAccountOptions;
            });

            scope.updateActivityOptions = function(activityId){
                if(activityId === 100){
                    scope.accountOptions = scope.glAccountOptions.assetAccountOptions;
                }else if(activityId === 200 || activityId === 201){
                    scope.accountOptions = scope.glAccountOptions.liabilityAccountOptions;
                }else if(activityId === 300){
                    scope.accountOptions = scope.glAccountOptions.equityAccountOptions;
                }
            };

            scope.submit = function () {
                resourceFactory.officeToGLAccountMappingResource.create(this.formData, function (data) {
                    location.path('/viewfinancialactivitymapping/' + data.resourceId);
                });
            };

        }
    });
    mifosX.ng.application.controller('AddFinancialMappingController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AddFinancialMappingController]).run(function ($log) {
        $log.info("AddFinancialMappingController initialized");
    });
}(mifosX.controllers || {}));
