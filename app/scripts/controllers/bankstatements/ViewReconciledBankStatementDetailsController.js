(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewReconciledBankStatementDetailsController: function (scope, resourceFactory, location, dateFilter, http, routeParams, API_VERSION, $upload, $rootScope) {

            scope.reconciledBankStatementDetails = [];
            scope.bankStatementId = routeParams.bankStatementId;
            scope.getReconciledBankStatementDetails = function(){
                resourceFactory.bankStatementDetailsResource.getBankStatementDetails({ bankStatementId : scope.bankStatementId, command:'reconciled'},function (data) {
                    scope.reconciledBankStatementDetails = data;
                });
            };
            scope.getReconciledBankStatementDetails();
        }
    });
    mifosX.ng.application.controller('ViewReconciledBankStatementDetailsController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.ViewReconciledBankStatementDetailsController]).run(function ($log) {
        $log.info("ViewReconciledBankStatementDetailsController initialized");
    });
}(mifosX.controllers || {}));
