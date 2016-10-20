(function (module) {
    mifosX.controllers = _.extend(module, {

        ViewTransactionController: function (scope, routeParams, resourceFactory, location, route, $modal, http, API_VERSION, $rootScope, $sce) {
            scope.flag = false;
            scope.manualEntry = false;
            scope.productName = routeParams.productName;
            scope.clientName = routeParams.clientName;
            scope.accountNo = routeParams.accountNo;
            scope.clientId = routeParams.clientId;
            scope.loanId = routeParams.loanId;
            scope.groupId = routeParams.groupId;
            scope.groupName = routeParams.groupName;
            scope.journalEntryTransactionId = routeParams.transactionId;
            scope.transactionIdStringvalue = routeParams.transactionId.toString();
            scope.bankStatementId = location.search().id;
            scope.isFromBankStatement = (scope.bankStatementId != undefined);
            scope.hidePentahoReport = true;
            scope.reportName = 'Journal Voucher';
            scope.reportOutputType = 'PDF';
            if(scope.journalEntryTransactionId != null && scope.journalEntryTransactionId !=""){
                scope.journalEntryTransactionId = scope.journalEntryTransactionId.substring(1,scope.journalEntryTransactionId.length);
            }


            resourceFactory.journalEntriesResource.get({transactionId: routeParams.transactionId, transactionDetails:true}, function (data) {
                scope.transactionNumber = routeParams.transactionId;
                scope.transactions = data.pageItems;
                for (var i in data.pageItems) {
                    scope.manualEntry = data.pageItems[i].manualEntry;
                    if (data.pageItems[i].reversed == false) {
                        scope.flag = true;
                    }
                }
            });
            scope.confirmation = function () {
                $modal.open({
                    templateUrl: 'confirmation.html',
                    controller: ConfirmationCtrl,
                    resolve: {
                        id: function () {
                            return scope.trxnid;
                        }
                    }
                });
            };

            var ConfirmationCtrl = function ($scope, $modalInstance, id) {
                $scope.transactionnumber = id.transactionId;
                $scope.redirect = function () {
                    $modalInstance.close('delete');
                    location.path('/viewtransactions/' + id.transactionId);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.showTransaction = function (transaction) {
                scope.transaction = transaction;
                $modal.open({
                    templateUrl: 'viewjournalentry.html',
                    controller: ViewJournalEntryCtrl,
                    resolve: {
                        transaction: function () {
                            return scope.transaction;
                        }
                    }
                });
            };

            var ViewJournalEntryCtrl = function ($scope, $modalInstance, transaction) {
                $scope.transaction = transaction;
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.reverseTransaction = function (transactionId) {
                $modal.open({
                    templateUrl: 'reverseTransaction.html',
                    controller: ReverseJournalEntriesCtrl,
                    resolve: {
                        transactionId: function () {
                            return transactionId;
                        }
                    }
                });
            }

            var ReverseJournalEntriesCtrl = function ($scope, $modalInstance, transactionId) {
                $scope.data = {
                    reverseComments:""
                };
                $scope.reverse = function () {
                    reverseData = {transactionId: transactionId, comments: $scope.data.reverseComments};
                    resourceFactory.journalEntriesResource.reverse(reverseData, function (data) {
                    $modalInstance.dismiss('cancel');

                    scope.trxnid = data;
                    scope.confirmation();

                    route.reload();

                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.runReport = function () {
                scope.hidePentahoReport = false;

                var reportURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent(scope.reportName);
                reportURL += "?output-type=" + encodeURIComponent(scope.reportOutputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier + "&locale="
                + scope.optlang.code + "&dateFormat=" + scope.df + "&R_transactionId=" + scope.transactionIdStringvalue;

                reportURL = $sce.trustAsResourceUrl(reportURL);

                http.get(reportURL, {responseType: 'arraybuffer'}).
                    success(function (data, status, headers, config) {
                        var contentType = headers('Content-Type');
                        var file = new Blob([data], {type: contentType});
                        var fileContent = URL.createObjectURL(file);

                        scope.baseURL = $sce.trustAsResourceUrl(fileContent);
                });
            }
        }
    });
    mifosX.ng.application.controller('ViewTransactionController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', '$modal', '$http', 'API_VERSION', '$rootScope', '$sce', mifosX.controllers.ViewTransactionController]).run(function ($log) {
        $log.info("ViewTransactionController initialized");
    });
}(mifosX.controllers || {}));
