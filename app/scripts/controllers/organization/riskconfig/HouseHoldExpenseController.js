(function (module) {
    mifosX.controllers = _.extend(module, {
        HouseHoldExpenseController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            resourceFactory.cashFlowCategoryResource.getAll(function (response) {
                scope.houseHodExpenses = response;
            });

            scope.routeTo = function (id) {
                location.path('/viewhouseholdexpense/' + id);
            };

            scope.routeToExpense = function (id) {
                location.path('/expenses/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/edithouseholdexpense/' + id);
            }
        }
    });
    mifosX.ng.application.controller('HouseHoldExpenseController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.HouseHoldExpenseController]).run(function ($log) {
        $log.info("HouseHoldExpenseController initialized");
    });

}(mifosX.controllers || {}));