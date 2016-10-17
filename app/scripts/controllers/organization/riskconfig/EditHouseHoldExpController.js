(function (module) {
    mifosX.controllers = _.extend(module, {
        EditHouseHoldExpController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.entityType = routeParams.entityType;
            scope.houseHoldExpId = routeParams.id
            scope.categoryEnumOptions = [];
            scope.typeEnumOptions = [];

            resourceFactory.cashFloawCategoryTemplate.get(function (response) {
                scope.categoryEnumOptions = response.cashFlowCategoryTypeOptions;
                scope.typeEnumOptions = response.cashFlowTypeOptions;

                resourceFactory.cashFlowCategoryResource.get({cashFlowCategoryId: routeParams.id}, function (response) {
                    scope.cashFlowCategory = response;
                    scope.formData = {};
                    scope.formData.name = response.name;
                    scope.formData.description = response.description;
                    scope.formData.isActive = response.isActive;
                    scope.formData.categoryEnumId = response.categoryEnum.id;
                    scope.formData.typeEnumId = response.typeEnum.id;
                });
            });

            scope.submit = function () {
                scope.formData.locale = 'en';
                resourceFactory.cashFlowCategoryResource.update({cashFlowCategoryId: routeParams.id}, scope.formData, function (response) {
                    if(scope.entityType === 'viewhouseholdexp'){
                        location.path('/viewhouseholdexpense/'+routeParams.id);
                    }else{
                        location.path('/householdexpense');
                    }

                });
            }
        }
    });
    mifosX.ng.application.controller('EditHouseHoldExpController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.EditHouseHoldExpController]).run(function ($log) {
        $log.info("EditHouseHoldExpController initialized");
    });
}(mifosX.controllers || {}));
