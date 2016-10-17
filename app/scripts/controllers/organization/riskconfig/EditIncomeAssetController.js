(function (module) {
    mifosX.controllers = _.extend(module, {
        EditIncomeAssetController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.entityType = routeParams.entityType;
            scope.entityId = routeParams.entityId;
            scope.assetId = routeParams.assetId;
            scope.stabilityEnumOptions = [];
            scope.cashFlowCategoryOptions = [];
            scope.cashFlowCategories = {};

            resourceFactory.incomeExpensesTemplate.get(function (response) {
                scope.cashFlowCategoryOptions = response.cashFlowCategoryOptions;
                scope.stabilityEnumOptions = response.stabilityEnumOptions;

                resourceFactory.incomeExpenses.get({
                    incomeAndExpenseId: scope.assetId,
                    isFetchCashflowCategoryData: true
                }, function (response) {
                    scope.formData = response;
                    scope.cashFlowCategories.name = response.cashFlowCategoryData.name;
                    scope.formData.stabilityEnumId = response.stabilityEnum.id;

                    delete scope.formData.stabilityEnum;
                    delete scope.formData.cashFlowCategoryData;
                    delete scope.formData.cashflowCategoryId;
                });
            });

            scope.submit = function () {
                scope.formData.locale = "en";
                if (scope.formData) {
                    delete scope.formData.id;
                }
                resourceFactory.incomeExpenses.update({incomeAndExpenseId: scope.assetId}, scope.formData, function (data) {
                    location.path('/'+scope.entityType+'/'+scope.entityId+'/assets/' + scope.assetId);
                });
            }
        }
    });
    mifosX.ng.application.controller('EditIncomeAssetController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.EditIncomeAssetController]).run(function ($log) {
        $log.info("EditIncomeAssetController initialized");
    });
}(mifosX.controllers || {}));
