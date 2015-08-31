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

            scope.chargesPerPage = 10;
            scope.transactionsPerPage=5;

            scope.getClientChargeResultsPage = function (pageNumber) {
                if(scope.searchText){
                    var startPosition = (pageNumber - 1) * scope.chargesPerPage;
                    scope.charges = scope.actualCharges.slice(startPosition, startPosition + scope.chargesPerPage);
                    return;
                }
                var items = resourceFactory.clientChargesResource.getCharges({clientId: routeParams.id,
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

                resourceFactory.clientChargesResource.getCharges({clientId: routeParams.id}, function (data) {
                    scope.charges = data;
                });

                /*var chargesItems = resourceFactory.clientChargesResource.getCharges({clientId: routeParams.id,
                    offset: 0,
                    limit: scope.chargesPerPage
                }, function (data) {
                    scope.totalCharges= data.totalFilteredRecords;
                    scope.charges = data.pageItems;
                });*/
                var transactionItems = resourceFactory.clientTransactionResource.getTransactions({clientId: routeParams.id,
                    offset: 0,
                    limit: scope.transactionsPerPage
                }, function (data) {
                    scope.totalTransactions= data.totalFilteredRecords;
                    scope.transactions = data.pageItems;
                });
            }
            scope.initPage();
            scope.search = function () {
                scope.actualCharges = [];
                scope.filterText = "";
                if(!scope.searchText){
                    scope.initPage();
            } else {
                resourceFactory.globalSearch.search({query: scope.searchText , resource: "clientCharges"}, function (data) {
                    var arrayLength = data.length;
                    for (var i = 0; i < arrayLength; i++) {
                        var result = data[i];
                        var charge = {};
                        charge.id=result.chargeId;
                        charge.officeName=result.officeName;
                        charge.amountPaid=result.amountPaid;
                        charge.amountWaived=result.amountWaived;
                        charge.amountOutstnading=result.amountOutstnading;
                        scope.actualCharges.push(charge);

                    }
                    var numberOfCharges = arrayLength;
                    scope.totalCharges = numberOfCharges;
                    scope.clients = scope.actualCharges.slice(0, scope.chargesPerPage);

                });
                resourceFactory.globalSearch.search({query: scope.searchText , resource: "clientTransaction"}, function (data) {
                    var arrayLength = data.length;
                    for (var i = 0; i < arrayLength; i++) {
                        var result = data[i];
                        var transaction = {};
                        transaction.id=result.transactionId;
                        transaction.officeName=result.officeName;
                        transaction.date=result.dueDate;
                        transaction.type.value=result.transactionType;
                        transaction.amount=result.transactionAmount;
                        scope.actualTransactions.push(transaction);

                    }
                    var numberOfTransactions = arrayLength;
                    scope.totalTransactions = numberOfTransactions;
                    scope.transactions = scope.actualTransactions.slice(0, scope.transactionsPerPage);

                });
            }
        }

    }
});
    mifosX.ng.application.controller('ClientChargesOverviewController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ClientChargesOverviewController]).run(function ($log) {
        $log.info("ClientChargesOverviewController initialized");
    });
}(mifosX.controllers || {}));
