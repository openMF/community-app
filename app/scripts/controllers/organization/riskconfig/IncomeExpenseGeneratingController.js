(function (module) {
    mifosX.controllers = _.extend(module, {
        IncomeExpenseGeneratingController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            resourceFactory.cashFlowCategoryResource.getAll(function (response) {
                scope.incomeGeneratingAssets = response;
            });

            scope.routeTo = function (id) {
                location.path('/viewincomegeneratingasset/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/editincomegeneratingasset/' + id);
            }
        }
    });
    mifosX.ng.application.controller('IncomeExpenseGeneratingController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.IncomeExpenseGeneratingController]).run(function ($log) {
        $log.info("IncomeExpenseGeneratingController initialized");
    });

}(mifosX.controllers || {}));