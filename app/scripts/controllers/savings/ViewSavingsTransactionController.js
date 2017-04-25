(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSavingsTransactionController: function (scope, resourceFactory, location, routeParams, dateFilter, $uibModal) {
            scope.flag = false;
            resourceFactory.savingsTrxnsResource.get({savingsId: routeParams.accountId, transactionId: routeParams.id}, function (data) {
                scope.transaction = data;
                if (scope.transaction.transactionType.value == 'Transfer' || scope.transaction.reversed == 'true' || scope.transaction.transactionType.id==3 || scope.transaction.transactionType.id==17) {
                    scope.flag = true;
                }
            });
            
            scope.undo = function (accountId, transactionId) {
                $uibModal.open({
                    templateUrl: 'undotransaction.html',
                    controller: UndoTransactionModel,
                    resolve: {
                        accountId: function () {
                          return accountId;
                        },
                        transactionId: function () {
                          return transactionId;
                        }
                    }
                });
            };
            
            var UndoTransactionModel = function ($scope, $uibModalInstance, accountId, transactionId) {
                $scope.undoTransaction = function () {
                    var params = {savingsId: accountId, transactionId: transactionId, command: 'undo'};
                    var formData = {dateFormat: scope.df, locale: scope.optlang.code, transactionAmount: 0};
                    formData.transactionDate = dateFilter(new Date(), scope.df);
                    resourceFactory.savingsTrxnsResource.save(params, formData, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/viewsavingaccount/' + data.savingsId);
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewSavingsTransactionController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', '$uibModal', mifosX.controllers.ViewSavingsTransactionController]).run(function ($log) {
        $log.info("ViewSavingsTransactionController initialized");
    });
}(mifosX.controllers || {}));
