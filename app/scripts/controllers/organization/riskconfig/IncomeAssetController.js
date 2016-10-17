(function (module) {
    mifosX.controllers = _.extend(module, {
        IncomeAssetController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            if(!_.isUndefined(routeParams.incomeGeneratingAssetId)){
                scope.entityId = routeParams.incomeGeneratingAssetId
            } else if(!_.isUndefined( routeParams.entityId)){
                scope.entityId = routeParams.entityId
            }

            scope.stabilityEnumOptions = [];
            scope.cashFlowCategories = {};

            resourceFactory.incomeExpenses.getAll({
                cashFlowCategoryId: scope.entityId,
                isFetchCashflowCategoryData: true
            }, function (response) {
                scope.assets = response;
                scope.cashFlowCategories.name = response[0].cashFlowCategoryData.name;
            });


            scope.routeTo = function (id) {
                location.path('/'+scope.entityId+'/viewasset/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/asset/' + scope.entityId + '/editasset/' + id);
            }
        }
    });
    mifosX.ng.application.controller('IncomeAssetController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.IncomeAssetController]).run(function ($log) {
        $log.info("IncomeAssetController initialized");
    });

}(mifosX.controllers || {}));