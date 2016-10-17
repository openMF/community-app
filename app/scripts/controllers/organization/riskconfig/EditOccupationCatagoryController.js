(function (module) {
    mifosX.controllers = _.extend(module, {
        EditOccupationCatagoryController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.entityType = routeParams.entityType;
            scope.categoryEnumOptions = [];
            scope.typeEnumOptions = [];

            resourceFactory.cashFloawCategoryTemplate.get(function (response) {
                scope.categoryEnumOptions = response.cashFlowCategoryTypeOptions;
                scope.typeEnumOptions = response.cashFlowTypeOptions;
                resourceFactory.cashFlowCategoryResource.get({cashFlowCategoryId: routeParams.id}, function (response) {
                    scope.formData = response;
                    scope.cashFlowCategory = response;
                    scope.formData.categoryEnumId = response.categoryEnum.id;
                    scope.formData.typeEnumId = response.typeEnum.id;
                    delete scope.formData.categoryEnum;
                    delete scope.formData.typeEnum;
                });
            });

            scope.submit = function () {
                if (scope.formData) {
                    delete scope.formData.id;
                }
                if (scope.formData.shortName != null || scope.formData.shortName != "") {
                    delete scope.formData.shortName;
                }
                scope.formData.locale = 'en';
                resourceFactory.cashFlowCategoryResource.update({cashFlowCategoryId: routeParams.id}, scope.formData, function (response) {
                    if(scope.entityType == 'viewocccategory'){
                        location.path('/viewoccupationcategory/'+routeParams.id);
                    }else {
                        location.path('/occupationcatagory');
                    }

                });
            }
        }
    });
    mifosX.ng.application.controller('EditOccupationCatagoryController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.EditOccupationCatagoryController]).run(function ($log) {
        $log.info("EditOccupationCatagoryController initialized");
    });
}(mifosX.controllers || {}));
