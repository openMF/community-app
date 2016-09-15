(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewBankStatementSummaryController: function (scope, resourceFactory, location, http, routeParams, $rootScope) {
            scope.bankStatement  = [];
            resourceFactory.bankStatementSummaryResource.get({ bankStatementId : routeParams.bankStatementId},function (data) {
                scope.bankStatement = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewBankStatementSummaryController', ['$scope', 'ResourceFactory', '$location', '$http', '$routeParams', '$rootScope', mifosX.controllers.ViewBankStatementSummaryController]).run(function ($log) {
        $log.info("ViewBankStatementSummaryController initialized");
    });
}(mifosX.controllers || {}));
