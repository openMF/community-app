(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSavingDepositAccrualTransactionController: function (scope, routeParams, resourceFactory, paginatorService, location, $uibModal, route, dateFilter, $sce, $rootScope, API_VERSION) {
            scope.report = false;
            scope.hidePentahoReport = true;
            scope.showActiveCharges = true;
            scope.formData = {};
            scope.date = {};
            scope.staffData = {};
            scope.fieldOfficers = [];
            scope.savingaccountdetails = [];
            scope.hideAccrualTransactions = true;
            scope.subStatus = false;

            scope.transactionsPerPage = 15;


            /***
             * we are using orderBy(https://docs.angularjs.org/api/ng/filter/orderBy) filter to sort fields in ui
             * api returns dates in array format[yyyy, mm, dd], converting the array of dates to date object
             * @param dateFieldName
             */
            scope.convertDateArrayToObject = function (dateFieldName) {
                for (var i in scope.savingaccountdetails.transactions) {
                    scope.savingaccountdetails.transactions[i][dateFieldName] = new Date(scope.savingaccountdetails.transactions[i].date);
                }
            };

            scope.getResultsPage = function (pageNumber) {
                if (location.search().savingsId != null) {
                    scope.getSavingsAccruals(pageNumber);
                } else if (location.search().recurringDepositId != null) {
                    scope.getRecurringDepositAccruals(pageNumber);
                } else if (location.search().fixedDepositId != null) {
                    scope.getFixedDepositAccruals(pageNumber);
                }
            }

            scope.routeTo = function (savingsAccountId, transactionId, accountTransfer) {
                if (location.search().savingsId != null) {
                    location.path('/viewsavingtrxn/' + savingsAccountId + '/trxnId/' + transactionId);
                } else if (location.search().recurringDepositId != null) {
                    location.path('/viewrecurringdepositaccounttrxn/' + savingsAccountId + '/' + transactionId);
                } else if (location.search().fixedDepositId != null) {
                    location.path('/viewfixeddepositaccounttrxn/' + savingsAccountId + '/' + transactionId);
                }
            };

            scope.getSavingsAccruals = function (pageNumber) {
                var items = resourceFactory.savingsResource.get({
                    accountId: location.search().savingsId, associations: 'accrualTransactions',
                    pageNumber: pageNumber, pageSize: scope.transactionsPerPage
                }, function (data) {
                    scope.savingaccountdetails = data;
                    scope.convertDateArrayToObject('date');
                    console.log(data);
                    if (scope.savingaccountdetails.transactions) {
                        resourceFactory.savingsResourceTransaction.get({
                                accountId: location.search().savingsId,
                                associations: 'accrualTransactions',
                                resourceType: 'transactionCount'
                            },
                            function (data) {
                                console.log(data);
                                scope.totalTransactions = data.transactionCount;
                            });
                    }
                });
            }

            scope.getFixedDepositAccruals = function (pageNumber) {
                resourceFactory.fixedDepositAccountResource.get({
                    accountId: location.search().fixedDepositId, associations: 'accrualTransactions',
                    pageNumber: pageNumber, pageSize: scope.transactionsPerPage
                }, function (data) {
                    scope.savingaccountdetails = data;
                    scope.convertDateArrayToObject('date');
                    if (scope.savingaccountdetails.transactions) {
                        scope.totalTransactions = data.transactionCount;
                    }
                });
            }

            scope.getRecurringDepositAccruals = function (pageNumber) {
                resourceFactory.recurringDepositAccountResource.get({
                    accountId: location.search().recurringDepositId, associations: 'accrualTransactions',
                    pageNumber: pageNumber, pageSize: scope.transactionsPerPage
                }, function (data) {
                    scope.savingaccountdetails = data;
                    scope.convertDateArrayToObject('date');
                    if (scope.savingaccountdetails.transactions) {
                        scope.totalTransactions = data.transactionCount;
                    }
                });
            }

            if (location.search().savingsId != null) {
                scope.getSavingsAccruals(1);
                scope.formData.savingsaccountId = location.search().savingsId;
                scope.isValid = true;
                scope.path = "#/viewsavingaccount/" + location.search().savingsId;
            }
            if (location.search().recurringDepositId != null) {
                scope.getRecurringDepositAccruals(1);
                scope.formData.savingsaccountId = location.search().recurringDepositId;
                scope.isValid = true;
                scope.path = "#/viewrecurringdepositaccount/" + location.search().recurringDepositId;
            }

            if (location.search().fixedDepositId != null) {
                scope.getFixedDepositAccruals(1);
                scope.formData.savingsaccountId = location.search().fixedDepositId;
                scope.isValid = true;
                scope.path = "#/viewfixeddepositaccount/" + location.search().fixedDepositId;
            }

            scope.viewSavingsTransactionReceipts = function (transactionId) {
                scope.report = true;
                scope.viewTransactionReport = true;
                scope.viewSavingReport = false;
                scope.printbtn = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Savings Transaction Receipt");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier + "&locale=" + scope.optlang.code;

                var reportParams = "";
                var paramName = "R_transactionId";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(transactionId);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }
                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.viewReportDetails = $sce.trustAsResourceUrl(scope.baseURL);

            };


            scope.printReport = function () {
                window.print();
                window.close();
            };


            scope.transactionSort = {
                column: 'date',
                descending: true
            };

            scope.changeTransactionSort = function (column) {
                var sort = scope.transactionSort;
                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = true;
                }
            };
        }
    });
    mifosX.ng.application.controller('ViewSavingDepositAccrualTransactionController', ['$scope', '$routeParams', 'ResourceFactory', 'PaginatorService', '$location', '$uibModal', '$route', 'dateFilter', '$sce', '$rootScope', 'API_VERSION', mifosX.controllers.ViewSavingDepositAccrualTransactionController]).run(function ($log) {
        $log.info("ViewSavingDepositAccrualTransactionController initialized");
    });
}(mifosX.controllers || {}));
