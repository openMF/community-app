(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateClientOccupationController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.clientId = routeParams.clientId;
            scope.formData = {};
            scope.subOccupations = [];
            scope.formData.clientMonthWiseIncomeExpense = [];
            scope.formData.isMonthWiseIncome = false;

            resourceFactory.cashFlowCategoryResource.getAll({isFetchIncomeExpenseDatas: true}, function(data){
               scope.occupations  = data;
            });

            scope.slectedOccupation = function(occupationId, subOccupationId){
                    _.each(scope.occupationOption.incomeExpenseDatas, function(iterate){
                        if(iterate.cashflowCategoryId == occupationId && iterate.isQuantifierNeeded == true && iterate.id == subOccupationId){
                            scope.quantifierLabel = iterate.quantifierLabel;
                            scope.isQuantifierNeeded = iterate.isQuantifierNeeded;
                        } else {
                            scope.isQuantifierNeeded = false;
                        }
                    })
            }

            scope.subOccupationNotAvailable = function(occupationId){
                _.each(scope.occupationOption, function(occupation){
                    if(occupation == occupationId && _.isUndefined(occupation.incomeExpenseDatas)){
                        scope.isQuantifierNeeded = false;
                        return scope.isQuantifierNeeded;
                    }
                })
            }

            scope.submit = function () {
                scope.formData.locale = "en";

                resourceFactory.incomeExpenseAndHouseHoldExpense.save({clientId: scope.clientId},scope.formData, function (data) {
                    location.path('/viewclient/' + scope.clientId)
                });
            }
        }
    });
    mifosX.ng.application.controller('CreateClientOccupationController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.CreateClientOccupationController]).run(function ($log) {
        $log.info("CreateClientOccupationController initialized");
    });
}(mifosX.controllers || {}));
