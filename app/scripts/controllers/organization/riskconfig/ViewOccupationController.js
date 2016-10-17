(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewOccupationController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.cashFlowCategoryId = routeParams.cashFlowCategoryId;
            scope.incomeAndExpenseId = routeParams.incomeAndExpenseId;
            scope.stabilityEnumOptions = [];
            scope.cashFlowCategoryOptions = [];
            scope.cashFlowCategories = {};

            resourceFactory.incomeExpenses.get({
                incomeAndExpenseId: scope.incomeAndExpenseId,
                isFetchCashflowCategoryData: true
            }, function (response) {
                scope.incomeExpense = response;
                scope.cashFlowCategories.name = response.cashFlowCategoryData.name;
                scope.stabilityEnumId = response.stabilityEnum.id;
                scope.stabilityEnumName = response.stabilityEnum.value;
            });

            var OccupationActivateCtrl = function ($scope, $modalInstance, incomeExpenseId) {
                $scope.delete = function () {
                    resourceFactory.incomeExpenses.save({
                        incomeAndExpenseId: incomeExpenseId,
                        command: 'activate'
                    }, {}, function (data) {
                        $modalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }

            scope.activateOccupation = function (id) {
                $modal.open({
                    templateUrl: 'activateoccupation.html',
                    controller: OccupationActivateCtrl,
                    resolve: {
                        incomeExpenseId: function () {
                            return id;
                        }
                    }
                });
            };

            var OccupationInActivateCtrl = function ($scope, $modalInstance, incomeExpenseId) {
                $scope.delete = function () {
                    resourceFactory.incomeExpenses.save({
                        incomeAndExpenseId: incomeExpenseId,
                        command: 'inactivate'
                    }, {}, function (data) {
                        $modalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }

            scope.inActivateOccupation = function (id) {
                $modal.open({
                    templateUrl: 'inactivateoccupation.html',
                    controller: OccupationInActivateCtrl,
                    resolve: {
                        incomeExpenseId: function () {
                            return id;
                        }
                    }
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewOccupationController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.ViewOccupationController]).run(function ($log) {
        $log.info("ViewOccupationController initialized");
    });

}(mifosX.controllers || {}));