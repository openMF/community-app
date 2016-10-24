(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewBankStatementController: function (scope, resourceFactory, location, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.bankStatements  = [];
            scope.baseUri = $rootScope.hostUrl+API_VERSION+'/bankstatement/1/documents/';
            scope.appendedUri = '/attachment?tenantIdentifier='+$rootScope.tenantIdentifier;
            scope.getBankStatement = function() {
                resourceFactory.bankStatementsResource.getAllBankStatement(function (data) {
                    scope.bankStatements = data;
                    for(var i = 0;i< scope.bankStatements.length; i++){
                        scope.bankStatements[i].cpifDownloadUri = scope.baseUri+ scope.bankStatements[i].cpifKeyDocumentId+ scope.appendedUri;
                        if(scope.bankStatements[i].orgStatementKeyDocumentId > 0){
                            scope.bankStatements[i].orgDownloadUri = scope.baseUri+ scope.bankStatements[i].orgStatementKeyDocumentId+ scope.appendedUri;
                        }else{
                            scope.bankStatements[i].orgDownloadUri = null;
                        }
                    }
                });
            };

            scope.getBankStatement();

            scope.deleteBankStatement = function(bankStatementId){
                scope.formData = {};
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
                resourceFactory.deleteBankStatementsResource.deleteBankStatement({bankStatementId : bankStatementId},scope.formData, function (data) {
                    scope.getBankStatement();
                });
            };

            scope.makeBankStatementReconcile = function(id){
                resourceFactory.bankStatementsResource.reconcileBankStatement({ bankStatementId : id}, function (data) {
                    scope.getBankStatement();
                    location.path('/bankstatements');
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewBankStatementController', ['$scope', 'ResourceFactory', '$location', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.ViewBankStatementController]).run(function ($log) {
        $log.info("ViewBankStatementController initialized");
    });
}(mifosX.controllers || {}));