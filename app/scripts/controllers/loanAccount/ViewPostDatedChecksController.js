(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewPostDatedChecksController: function (scope, routeParams, resourceFactory,paginatorService, location, route, http, $uibModal, dateFilter, API_VERSION, $sce, $rootScope) {
            scope.formData = {};
            scope.loanId = routeParams.loanId;
            scope.id = routeParams.id;
            scope.postDatedCheck = {};
            scope.postDatedId = null;

            resourceFactory.postDatedChecks.get({loanId: scope.loanId, installmentId: scope.id}, function(data) {
                scope.postDatedCheck = data;
                scope.postDatedId = data.id;
                scope.postDatedCheck.installmentDate = new Date(scope.postDatedCheck.installmentDate);
                console.log(data);
            });

            // Delete post dated check
            scope.deletePostDatedCheck = function() {
                $uibModal.open({
                    templateUrl: 'deletepostdatedcheck.html',
                    controller: PostDatedDeleteCtrl
                });
            }

            var PostDatedDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.postDatedCheckById.delete({loanId: scope.loanId, id: scope.postDatedId}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/viewloanaccount/' + scope.loanId);
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewPostDatedChecksController', ['$scope', '$routeParams', 'ResourceFactory','PaginatorService', '$location', '$route', '$http', '$uibModal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', mifosX.controllers.ViewPostDatedChecksController]).run(function ($log) {
        $log.info("ViewPostDatedChecksController initialized");
    });
}(mifosX.controllers || {}));
