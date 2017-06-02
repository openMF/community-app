(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewRecurringDepositTransactionController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.flag = false;
            resourceFactory.recurringDepositTrxnsResource.get({savingsId: routeParams.accountId, transactionId: routeParams.transactionId}, function (data) {
                scope.transaction = data;
                if (scope.transaction.transactionType.value == 'Transfer' || scope.transaction.reversed == 'true') {
                    scope.flag = true;
                }
            });

            scope.undoTransaction = function (accountId, transactionId) {
                var params = {savingsId: accountId, transactionId: transactionId, command: 'undo'};
                var formData = {dateFormat: scope.df, locale: scope.optlang.code, transactionAmount: 0};
                formData.transactionDate = dateFilter(new Date(), scope.df);
                resourceFactory.recurringDepositTrxnsResource.save(params, formData, function (data) {
                    location.path('/viewrecurringdepositaccount/' + data.savingsId);
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewRecurringDepositTransactionController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ViewRecurringDepositTransactionController]).run(function ($log) {
        $log.info("ViewRecurringDepositTransactionController initialized");
    });
}(mifosX.controllers || {}));
