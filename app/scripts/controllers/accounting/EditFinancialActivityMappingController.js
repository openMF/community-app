(function (module) {
    mifosX.controllers = _.extend(module, {
        EditFinancialActivityMappingController: function (scope, resourceFactory, location,routeParams) {
            scope.formData = {};
            scope.accountOptions = [];
            resourceFactory.officeToGLAccountMappingResource.withTemplate({mappingId: routeParams.mappingId},function (data) {
                scope.mapping = data;
                scope.glAccountOptions = data.glAccountOptions;
                scope.formData.financialActivityId = data.financialActivityData.id;
                scope.formData.glAccountId = data.glAccountData.id;
                scope.financialActivityOptions = data.financialActivityOptions;
                scope.updateActivityOptions(scope.formData.financialActivityId);
            });

            scope.updateActivityOptions = function(activityId){
                if(activityId === 100 || activityId === 101 || activityId === 102 || activityId === 103){
                    scope.accountOptions = scope.glAccountOptions.assetAccountOptions;
                }else if(activityId === 200 || activityId === 201){
                    scope.accountOptions = scope.glAccountOptions.liabilityAccountOptions;
                }else if(activityId === 300){
                    scope.accountOptions = scope.glAccountOptions.equityAccountOptions;
                }
            };

            scope.submit = function () {
                resourceFactory.officeToGLAccountMappingResource.update({mappingId: routeParams.mappingId},this.formData, function (data) {
                    location.path('/viewfinancialactivitymapping/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditFinancialActivityMappingController', ['$scope', 'ResourceFactory', '$location','$routeParams', mifosX.controllers.EditFinancialActivityMappingController]).run(function ($log) {
        $log.info("EditFinancialActivityMappingController initialized");
    });
}(mifosX.controllers || {}));
