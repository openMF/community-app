(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanPurposeGroupController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            resourceFactory.loanPurposeGroupResource.get({
                loanPurposeGroupsId: routeParams.id,
                isFetchLoanPurposeDatas: true
            }, function (data) {
                scope.loanpurposegroup = data;
            });

            var LoanPurposeGroupActivateCtrl = function ($scope, $modalInstance, loanPurposeGroupId) {
                $scope.delete = function () {
                    resourceFactory.loanPurposeGroupResource.save({
                            loanPurposeGroupsId: loanPurposeGroupId,
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

            scope.activateLoanPurposeGroup = function (id) {
                $modal.open({
                    templateUrl: 'activateloanpurposegroup.html',
                    controller: LoanPurposeGroupActivateCtrl,
                    resolve: {
                        loanPurposeGroupId: function () {
                            return id;
                        }
                    }
                });
            };

            var LoanPurposeGroupInActivateCtrl = function ($scope, $modalInstance, loanPurposeGroupId) {
                $scope.delete = function () {
                    resourceFactory.loanPurposeGroupResource.save({
                            loanPurposeGroupsId: loanPurposeGroupId,
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

            scope.inActivateLoanPurposeGroup = function (id) {
                $modal.open({
                    templateUrl: 'inactivateloanpurposegroup.html',
                    controller: LoanPurposeGroupInActivateCtrl,
                    resolve: {
                        loanPurposeGroupId: function () {
                            return id;
                        }
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewLoanPurposeGroupController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.ViewLoanPurposeGroupController]).run(function ($log) {
        $log.info("ViewLoanPurposeGroupController initialized");
    });

}(mifosX.controllers || {}));