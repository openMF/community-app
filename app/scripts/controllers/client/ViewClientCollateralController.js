(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewClientCollateralController: function (scope, resourceFactory, routeParams, location, $uibModal) {

            scope.formData = {};
            scope.clientId = routeParams.id;
            scope.collateralId = routeParams.collateralId;
            scope.loanTransactions = [];
            console.log(routeParams);

            resourceFactory.clientcollateralResource.get({clientId: scope.clientId, collateralParamId: scope.collateralId}, function (data) {
                scope.collateral = data;
                console.log(data);
                scope.loanTransactions = scope.collateral.loanTransactionData;
                for (var i=0; i<scope.loanTransactions.length; i++){
                	scope.loanTransactions[i].lastRepaymentDate.date = new Date(scope.loanTransactions[i].lastRepaymentDate.date);
                }
                console.log(scope.loanTransactions)
            });

            scope.deleteClientCollateral = function () {
                $uibModal.open({
                    templateUrl: 'deleteclientcollateral.html',
                    controller: CollateralDeleteCtrl
                });
            };

            scope.TransactionsPerPage =15;

            var CollateralDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    console.log(scope.clientId);
                    resourceFactory.clientcollateralResource.delete({clientId: scope.clientId, collateralParamId: scope.collateralId}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/viewclient/' + scope.clientId);
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            // resourceFactory.loanCollateralTemplateResource.get({loanId: scope.loanId}, function (data) {
            //     scope.collateralTypes = data.allowedCollateralTypes;
            //     scope.formData.collateralTypeId = data.allowedCollateralTypes[0].id;
            // });

            scope.cancel = function () {
                location.path('/viewclient/' + scope.clientId);
            };



        }
    });
    mifosX.ng.application.controller('ViewClientCollateralController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewClientCollateralController]).run(function ($log) {
        $log.info("ViewClientCollateralController initialized");
    });
}(mifosX.controllers || {}));
