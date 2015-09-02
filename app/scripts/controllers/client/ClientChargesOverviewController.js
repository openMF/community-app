(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientChargesOverviewController: function (scope, resourceFactory, location,routeParams, dateFilter) {
            scope.clientId =  routeParams.id
            scope.charges = [];
            scope.actualCharges = [];
            scope.transactions = [];
            scope.actualTransactions = [];
            scope.searchText = "";

           scope.routeTo = function (chargeId) {
                location.path('/viewclient/'+ scope.clientId + '/charges/'+chargeId);
            };

            scope.chargesPerPage = 2;
            scope.transactionsPerPage=5;

            scope.getClientChargeResultsPage = function (pageNumber) {
                if(scope.searchText){
                    var startPosition = (pageNumber - 1) * scope.chargesPerPage;
                    scope.charges = scope.actualCharges.slice(startPosition, startPosition + scope.chargesPerPage);
                    return;
                }
                var items = resourceFactory.clientChargesResource.getClientCharges({clientId: routeParams.id,
                    offset: ((pageNumber - 1) * scope.chargesPerPage),
                    limit: scope.chargesPerPage
                }, function (data) {
                    scope.charges = data.pageItems;
                });

            }

            scope.getClientTransactionsResultsPage = function (pageNumber) {
                if(scope.searchText){
                    var startPosition = (pageNumber - 1) * scope.transactionsPerPage;
                    scope.transactions = scope.actualTransactions.slice(startPosition, startPosition + scope.transactionsPerPage);
                    return;
                }
                var items = resourceFactory.clientTransactionResource.getTransactions({clientId: routeParams.id,
                    offset: ((pageNumber - 1) * scope.transactionsPerPage),
                    limit: scope.transactionsPerPage
                }, function (data) {
                    scope.transactions = data.pageItems;
                });
            }

            scope.initPage = function () {

               var chargesItems = resourceFactory.clientChargesResource.getClientCharges({clientId: routeParams.id,
                    offset: 0,
                    limit: scope.chargesPerPage
                }, function (data) {
                    scope.totalCharges= data.totalFilteredRecords;
                    scope.charges = data.pageItems;
                });
                var transactionItems = resourceFactory.clientTransactionResource.getTransactions({clientId: routeParams.id,
                    offset: 0,
                    limit: scope.transactionsPerPage
                }, function (data) {
                    scope.totalTransactions= data.totalFilteredRecords;
                    scope.transactions = data.pageItems;
                });
            }
            scope.initPage();

    }
});
    mifosX.ng.application.controller('ClientChargesOverviewController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ClientChargesOverviewController]).run(function ($log) {
        $log.info("ClientChargesOverviewController initialized");
    });
}(mifosX.controllers || {}));
