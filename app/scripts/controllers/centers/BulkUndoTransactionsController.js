(function (module) {
    mifosX.controllers = _.extend(module, {
        BulkUndoTransactionsController: function (scope, rootScope, routeParams, resourceFactory, location, dateFilter, route) {

            scope.centerId = routeParams.centerId;
            scope.transactionsDate = new Date();
            scope.transactionData = [];

            resourceFactory.centerResource.get({centerId: scope.centerId, associations: 'groupMembers,collectionMeetingCalendar'}, function (data) {
                scope.center = data;
            });

            scope.getLoanRepaymentDetails = function () {
                resourceFactory.centerBulkTransactionResource.get({
                    centerId: scope.centerId,
                    transactionDate: dateFilter(scope.transactionsDate, "yyyy-MM-dd")
                }, function (data) {
                    scope.transactionData = data;
                });
            };

            scope.checkAll = function () {
                if (scope.selectedAll) {
                    scope.selectedAll = true;
                } else {
                    scope.selectedAll = false;
                }
                angular.forEach(scope.transactionData, function (txn) {
                    txn.isSelected = !scope.selectedAll;
                });
            };

            scope.cancel = function () {
                history.back();
            };

            scope.submit = function () {

                this.batchRequests = [];
                for (var i in scope.transactionData) {
                    if( scope.transactionData[i].isSelected ){

                        var loanRepaymentTransaction = {};
                        loanRepaymentTransaction.dateFormat = scope.df;
                        loanRepaymentTransaction.locale = scope.optlang.code;
                        loanRepaymentTransaction.transactionAmount = 0;
                        loanRepaymentTransaction.transactionDate = dateFilter(scope.transactionsDate, scope.df);

                        var relativeUrl = "loans/"+scope.transactionData[i].id+"/transactions/"+scope.transactionData[i].transactions[0].id+"?command=undo";

                        this.batchRequests.push({requestId: i, relativeUrl: relativeUrl,
                            method: "POST", body: JSON.stringify(loanRepaymentTransaction)});

                    }
                }

                resourceFactory.batchResource.post(this.batchRequests, function (data) {
                    console.log('data : ',data);
                    scope.getLoanRepaymentDetails();
                });

            };

        }

    });
    mifosX.ng.application.controller('BulkUndoTransactionsController', ['$scope', '$rootScope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', '$route', mifosX.controllers.BulkUndoTransactionsController]).run(function ($log) {
        $log.info("BulkUndoTransactionsController initialized");
    });
}(mifosX.controllers || {}));