(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateExpenseController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.entityType = routeParams.entityType;
            scope.houseHoldExpenseId = routeParams.houseHoldExpenseId;

            scope.formData = {};
            scope.formData.cashFlowCategoryId = scope.houseHoldExpenseId;
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

                resourceFactory.incomeExpenses.save({cashFlowCategoryId: scope.houseHoldExpenseId}, scope.formData, function (data) {
                    location.path('/occupation/' + scope.houseHoldExpenseId)
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateExpenseController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.CreateExpenseController]).run(function ($log) {
        $log.info("CreateExpenseController initialized");
    });
}(mifosX.controllers || {}));
