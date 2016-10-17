(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewOccupationCategoryController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            resourceFactory.cashFlowCategoryResource.get({cashFlowCategoryId: routeParams.id}, function (response) {
                scope.cashFlowCategory = response;
            });

            var CashFlowCatagoryActivateCtrl = function ($scope, $modalInstance, occupationCategoryId) {
                $scope.delete = function () {
                    resourceFactory.cashFlowCategoryResource.save({
                        cashFlowCategoryId: occupationCategoryId,
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

            scope.activateCashFlowCatagory = function (id) {
                $modal.open({
                    templateUrl: 'activatecashflowcatagory.html',
                    controller: CashFlowCatagoryActivateCtrl,
                    resolve: {
                        occupationCategoryId: function () {
                            return id;
                        }
                    }
                });
            };

            var CashFlowCatagoryInActivateCtrl = function ($scope, $modalInstance, occupationCategoryId) {
                $scope.delete = function () {
                    resourceFactory.cashFlowCategoryResource.save({
                        cashFlowCategoryId: occupationCategoryId,
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

            scope.inActiveCashFlowCatagory = function (id) {
                $modal.open({
                    templateUrl: 'inactivecashflowcatagory.html',
                    controller: CashFlowCatagoryInActivateCtrl,
                    resolve: {
                        occupationCategoryId: function () {
                            return id;
                        }
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewOccupationCategoryController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.ViewOccupationCategoryController]).run(function ($log) {
        $log.info("ViewOccupationCategoryController initialized");
    });

}(mifosX.controllers || {}));