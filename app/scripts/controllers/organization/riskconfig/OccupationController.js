(function (module) {
    mifosX.controllers = _.extend(module, {
        OccupationController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.cashFlowCategoryId = routeParams.cashFlowCategoryId;
            scope.stabilityEnumOptions = [];
            scope.cashFlowCategories = {};

            resourceFactory.incomeExpenses.getAll({
                cashFlowCategoryId: scope.cashFlowCategoryId,
                isFetchCashflowCategoryData: true
            }, function (response) {
                scope.occupations = response;
                scope.cashFlowCategories.name = response[0].cashFlowCategoryData.name;
            });

            scope.routeTo = function (id) {
                location.path('/occupation/' + scope.cashFlowCategoryId + '/viewoccupation/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/occupation/'+ scope.cashFlowCategoryId +'/editoccupation/' + id);
            }
        }
    });
    mifosX.ng.application.controller('OccupationController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.OccupationController]).run(function ($log) {
        $log.info("OccupationController initialized");
    });

}(mifosX.controllers || {}));