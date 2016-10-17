(function (module) {
    mifosX.controllers = _.extend(module, {
        EditExpenseController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.entityType = routeParams.entityType;
            scope.entityId = routeParams.entityId;
            scope.houseHoldExpenseId = routeParams.houseHoldExpenseId;
            scope.stabilityEnumOptions = [];
            scope.cashFlowCategoryOptions = [];
            scope.cashFlowCategories = {};

            resourceFactory.incomeExpensesTemplate.get(function (response) {
                scope.cashFlowCategoryOptions = response.cashFlowCategoryOptions;
                scope.stabilityEnumOptions = response.stabilityEnumOptions;

                resourceFactory.incomeExpenses.get({
                    incomeAndExpenseId: scope.entityId,
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
                resourceFactory.incomeExpenses.update({incomeAndExpenseId: scope.entityId}, scope.formData, function (data) {
                    location.path('/expenses/' + scope.entityId);
                });
            }
        }
    });
    mifosX.ng.application.controller('EditExpenseController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.EditExpenseController]).run(function ($log) {
        $log.info("EditExpenseController initialized");
    });
}(mifosX.controllers || {}));
