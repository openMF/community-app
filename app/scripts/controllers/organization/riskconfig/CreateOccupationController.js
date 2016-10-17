(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateOccupationController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.entityType = routeParams.entityType;
            scope.cashFlowCategoryId = routeParams.cashFlowCategoryId;

            scope.formData = {};
            scope.formData.cashFlowCategoryId = scope.cashFlowCategoryId;
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

                resourceFactory.incomeExpenses.save({cashFlowCategoryId: routeParams.id}, scope.formData, function (data) {
                    location.path('/occupation/' + scope.cashFlowCategoryId)
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateOccupationController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.CreateOccupationController]).run(function ($log) {
        $log.info("CreateOccupationController initialized");
    });
}(mifosX.controllers || {}));
