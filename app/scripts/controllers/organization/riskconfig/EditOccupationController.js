(function (module) {
    mifosX.controllers = _.extend(module, {
        EditOccupationController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.cashFlowCategoryId = routeParams.cashFlowCategoryId;
            scope.incomeAndExpenseId = routeParams.incomeAndExpenseId;
            scope.stabilityEnumOptions = [];
            scope.cashFlowCategoryOptions = [];
            scope.cashFlowCategories = {};

            resourceFactory.incomeExpensesTemplate.get(function (response) {
                scope.cashFlowCategoryOptions = response.cashFlowCategoryOptions;
                scope.stabilityEnumOptions = response.stabilityEnumOptions;
            });

            resourceFactory.incomeExpenses.get({
                incomeAndExpenseId: scope.incomeAndExpenseId,
                isFetchCashflowCategoryData: true
            }, function (response) {
                scope.formData = response;
                scope.cashFlowCategories.name = response.cashFlowCategoryData.name;
                scope.formData.stabilityEnumId = response.stabilityEnum.id;

                delete scope.formData.stabilityEnum;
                delete scope.formData.cashFlowCategoryData;
                delete scope.formData.cashflowCategoryId;
            });

            scope.submit = function () {
                scope.formData.locale = "en";
                if (scope.formData) {
                    delete scope.formData.id;
                }
                resourceFactory.incomeExpenses.update({incomeAndExpenseId: scope.incomeAndExpenseId}, scope.formData, function (data) {
                    location.path('/occupation/' + scope.cashFlowCategoryId);
                });
            }
        }
    });
    mifosX.ng.application.controller('EditOccupationController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.EditOccupationController]).run(function ($log) {
        $log.info("EditOccupationController initialized");
    });
}(mifosX.controllers || {}));
