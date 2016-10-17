(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateIncomeAssetController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.entityType = routeParams.entityType;
            scope.incomeGeneratingAssetId = routeParams.incomeGeneratingAssetId;

            scope.formData = {};
            scope.formData.cashFlowCategoryId = scope.incomeGeneratingAssetId;
            scope.formData.isActive = true;
            scope.stabilityEnumOptions = [];
            scope.cashFlowCategories = {};

            resourceFactory.incomeExpensesTemplate.get(function (response) {
                scope.cashFlowCategoryOptions = response.cashFlowCategoryOptions;
                for (var i in  scope.cashFlowCategoryOptions) {
                    if (scope.cashFlowCategoryOptions[i].id === parseInt(scope.formData.cashFlowCategoryId)) {
                        scope.cashFlowCategories.name = scope.cashFlowCategoryOptions[i].name;
                        break;
                    }
                }
                scope.stabilityEnumOptions = response.stabilityEnumOptions;
            });

            scope.submit = function () {
                scope.formData.locale = "en";

                resourceFactory.incomeExpenses.save({cashFlowCategoryId: routeParams.incomeGeneratingAssetId}, scope.formData, function (data) {
                    location.path('/assets/' + scope.incomeGeneratingAssetId)
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateIncomeAssetController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.CreateIncomeAssetController]).run(function ($log) {
        $log.info("CreateIncomeAssetController initialized");
    });
}(mifosX.controllers || {}));
