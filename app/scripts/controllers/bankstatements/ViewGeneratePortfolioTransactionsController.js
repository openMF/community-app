(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewGeneratePortfolioTransactionsController: function (scope, resourceFactory, location, dateFilter, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.bankStatementDetails  = [];
            scope.bankStatementId = routeParams.bankStatementId;
            scope.isTransactionsCreated = true;

            scope.getBankStatementDetails = function(){
                resourceFactory.bankStatementDetailsResource.getBankStatementDetails({ bankStatementId : routeParams.bankStatementId, command:'generatetransactions'},function (data) {
                    scope.bankStatementDetails = data;
                });
            };

            scope.getBankStatementDetails();

            scope.submit = function() {
                scope.formData = {};
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
                resourceFactory.bankStatementGeneratePortfolioResource.createPortfolioTransactions({ bankStatementId : routeParams.bankStatementId},scope.formData,function (data) {
                    scope.getBankStatementDetails();
                    scope.isTransactionsCreated(scope.bankStatementDetails);
                });
            };

            scope.isTransactionsCreated = function(data){
                scope.isTransactionsCreated = true;
                var count = 0;
                for(var i=0;i<data.length;i++){
                    if(data[i].hasOwnProperty("transactionId")){
                        count++;
                    }
                }
                scope.isTransactionsCreated = (count==data.length);
            };

            scope.routeTo = function (data) {
                location.path('/viewloantrxn/' + data.loanAccountNumber+'/trxnId/'+data.transactionId);
            };
        }
    });
    mifosX.ng.application.controller('ViewGeneratePortfolioTransactionsController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.ViewGeneratePortfolioTransactionsController]).run(function ($log) {
        $log.info("ViewGeneratePortfolioTransactionsController initialized");
    });
}(mifosX.controllers || {}));
