(function (module) {
    mifosX.controllers = _.extend(module, {
        EditIncomeGeneratingController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.entityType = routeParams.entityType
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
                scope.formData.locale = 'en';
                if (scope.formData) {
                    delete scope.formData.id;
                }
                if (scope.formData.shortName != null || scope.formData.shortName != "") {
                    delete scope.formData.shortName;
                }

                resourceFactory.cashFlowCategoryResource.update({cashFlowCategoryId: routeParams.id}, scope.formData, function (response) {
                    if(scope.entityType == 'viewincomegenasset'){
                        location.path('/viewincomegeneratingasset/'+routeParams.id);
                    }else{
                        location.path('/incomegeneratingasset');
                    }

                });
            }
        }
    });
    mifosX.ng.application.controller('EditIncomeGeneratingController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.EditIncomeGeneratingController]).run(function ($log) {
        $log.info("EditIncomeGeneratingController initialized");
    });
}(mifosX.controllers || {}));
