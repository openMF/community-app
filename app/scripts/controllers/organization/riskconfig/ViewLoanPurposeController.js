(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanPurposeController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.loanPurposes = [];

            resourceFactory.loanPurposeResource.get({loanPurposeId: routeParams.id, isFetchLoanPurposeGroupDatas: true},
                function (data) {
                    scope.loanPurpose = data;
                    scope.loanPurposeData = data.loanPurposeGroupDatas;
                    for (var i in scope.loanPurposeData) {
                        if (scope.loanPurposeData[i].loanPurposeGroupType.name === "Grouping") {
                            scope.classificationName = scope.loanPurposeData[i].name;
                        }
                        if (scope.loanPurposeData[i].loanPurposeGroupType.name === "Consumption") {
                            scope.categoryName = scope.loanPurposeData[i].name;
                        }
                    }
                });

            var LoanPurposeActivateCtrl = function ($scope, $modalInstance, loanPurposeId) {
                $scope.delete = function () {
                    resourceFactory.loanPurposeResource.save({
                            loanPurposeId: loanPurposeId,
                            command: 'activate'
                        }, {},
                        function (data) {
                            $modalInstance.close('delete');
                            route.reload();
                        });
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }

            scope.activateLoanPurpose = function (id) {
                $modal.open({
                    templateUrl: 'activateloanpurpose.html',
                    controller: LoanPurposeActivateCtrl,
                    resolve: {
                        loanPurposeId: function () {
                            return id;
                        }
                    }
                });
            };

            var LoanPurposeInActivateCtrl = function ($scope, $modalInstance, loanPurposeId) {
                $scope.delete = function () {
                    resourceFactory.loanPurposeResource.save({
                            loanPurposeId: loanPurposeId,
                            command: 'inactivate'
                        }, {},
                        function (data) {
                            $modalInstance.close('delete');
                            route.reload();
                        });
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }

            scope.inActivateLoanPurpose = function (id) {
                $modal.open({
                    templateUrl: 'inactivateloanpurpose.html',
                    controller: LoanPurposeInActivateCtrl,
                    resolve: {
                        loanPurposeId: function () {
                            return id;
                        }
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewLoanPurposeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.ViewLoanPurposeController]).run(function ($log) {
        $log.info("ViewLoanPurposeController initialized");
    });

}(mifosX.controllers || {}));