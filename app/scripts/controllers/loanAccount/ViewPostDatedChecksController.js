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
            });

            scope.paymentTypes = [];
            scope.paymentTypeId;

            resourceFactory.paymentTypeResource.getAll(function(data) {
                scope.paymentTypes = data;
                scope.paymentTypes = scope.paymentTypes.filter((payment) => payment.name === "PDC");
                if (scope.paymentTypes === null || scope.paymentTypes.length === 0) {
                    $uibModal.open({
                        templateUrl: 'paymentType.html',
                        controller: PaymentTypeCtrl
                    });                   
                } else {
                    scope.paymentTypeId = scope.paymentTypes[0].id;
                }
            });         

            // Clear post dated check
            scope.clearPostDatedCheck = function() {
                $uibModal.open({
                    templateUrl: 'clearPostDatedCheck.html',
                    controller: PostDatedCheckClearCtrl
                });
            }

            var PaymentTypeCtrl = function ($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var PostDatedCheckClearCtrl = function ($scope, $uibModalInstance) {
                $scope.clear = function () {
                    var params = {command: "repayment"};
                    scope.formData = {
                        dateFormat: scope.df,
                        locale: "en",
                        paymentTypeId: scope.paymentTypeId,
                        transactionAmount: scope.postDatedCheck.amount,
                        transactionDate: dateFilter(new Date(scope.postDatedCheck.installmentDate), scope.df)
                    }
                    params.loanId = scope.loanId;
                    resourceFactory.loanTrxnsResource.save(params, scope.formData, function (data) {
                        location.path('/viewloanaccount/' + data.loanId);
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
