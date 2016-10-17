(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateHouseHoldExpenseController: function (scope, routeParams, resourceFactory, location, $modal, route) {
            scope.formData = {};
            scope.formData.isActive = true;
            scope.categoryEnumOptions = [];
            scope.typeEnumOptions = [];

            resourceFactory.cashFloawCategoryTemplate.get(function (response) {
                scope.categoryEnumOptions = response.cashFlowCategoryTypeOptions;
                scope.typeEnumOptions = response.cashFlowTypeOptions;
                for(var i in scope.categoryEnumOptions){
                    if(scope.categoryEnumOptions[i].value === "House Hold Expense"){
                        scope.houseHoldExpense = scope.categoryEnumOptions[i].value;
                        scope.formData.categoryEnumId = scope.categoryEnumOptions[i].id;
                        break;
                    }
                }
               scope.expense = _.find(scope.typeEnumOptions, function (expenses) {
                   return expenses.value === 'Expense';
               });

                if(scope.expense){
                    scope.formData.typeEnumId = scope.expense.id;
                }
            });

            scope.submit = function () {
                this.formData.locale = "en";
                resourceFactory.cashFlowCategoryResource.save(this.formData, function (response) {
                    location.path('/householdexpense');
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateHouseHoldExpenseController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.CreateHouseHoldExpenseController]).run(function ($log) {
        $log.info("CreateHouseHoldExpenseController initialized");
    });

}(mifosX.controllers || {}));