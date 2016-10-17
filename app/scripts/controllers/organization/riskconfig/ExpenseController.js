(function (module) {
    mifosX.controllers = _.extend(module, {
        ExpenseController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.houseHoldExpenseId = routeParams.houseHoldExpenseId;
            scope.stabilityEnumOptions = [];
            scope.cashFlowCategories = {};

            resourceFactory.incomeExpenses.getAll({
                cashFlowCategoryId: scope.houseHoldExpenseId,
                isFetchCashflowCategoryData: true
            }, function (response) {
                scope.occupations = response;
            });

            scope.routeTo = function (id) {
                location.path('/expense/' + scope.houseHoldExpenseId + '/viewexpense/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/expense/' + scope.houseHoldExpenseId + '/editexpense/' + id);
            }
        }
    });
    mifosX.ng.application.controller('ExpenseController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.ExpenseController]).run(function ($log) {
        $log.info("ExpenseController initialized");
    });

}(mifosX.controllers || {}));