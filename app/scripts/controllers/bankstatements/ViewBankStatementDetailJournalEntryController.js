(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewBankStatementDetailJournalEntryController: function (scope, resourceFactory, location, dateFilter, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.bankStatementDetails  = [];
            scope.bankStatementId = routeParams.bankStatementId;
            scope.isJournalEntryCreated = true;
            scope.bankName = "";
            scope.bankStatementName = "";
            scope.inflowAmount = 0;
            scope.outflowAmount = 0;

            resourceFactory.bankStatementsResource.getBankStatement({'bankStatementId': routeParams.bankStatementId}, function (data) {
                scope.bankStatementName = data.name;
                scope.bankName = data.bankData.name;
            });

            scope.getBankStatementDetails = function(){
                resourceFactory.bankStatementDetailsResource.getBankStatementDetails({ bankStatementId : routeParams.bankStatementId, command:'journalentry'},function (data) {
                    scope.bankStatementDetails = data;
                    console.log('data: ',data);
                    scope.inflowAmount = 0;
                    scope.outflowAmount = 0;
                    for(var i=0;i<data.length;i++){
                        if(data[i].accountingType =='CREDIT'){
                            scope.outflowAmount = scope.outflowAmount + data[i].amount;
                        }else{
                            scope.inflowAmount = scope.inflowAmount + data[i].amount;
                        }
                    }
                    scope.isJournalEntriesCreated(data);
                });
            };

            scope.getBankStatementDetails();

            scope.submit = function() {
                scope.formData = {};
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
                resourceFactory.bankNonPortfolioResource.createJournalEntries({ bankStatementId : routeParams.bankStatementId},scope.formData,function (data) {
                    scope.getBankStatementDetails();
                    scope.isJournalEntriesCreated(scope.bankStatementDetails);
                });
            };

            scope.isJournalEntriesCreated = function(data){
                scope.isJournalEntryCreated = true;
                var count = 0;
                for(var i=0;i<data.length;i++){
                    if(data[i].hasOwnProperty("transactionId")){
                        count++;
                    }
                }
                scope.isJournalEntryCreated = (count==data.length);
            };

            scope.routeTo = function (id) {
                location.path('/viewtransactions/' + id).search('id',routeParams.bankStatementId);
            };
        }
    });
    mifosX.ng.application.controller('ViewBankStatementDetailJournalEntryController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.ViewBankStatementDetailJournalEntryController]).run(function ($log) {
        $log.info("ViewBankStatementDetailJournalEntryController initialized");
    });
}(mifosX.controllers || {}));