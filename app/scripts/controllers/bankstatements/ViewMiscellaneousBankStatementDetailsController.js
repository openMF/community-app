(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewMiscellaneousBankStatementDetailsController: function (scope, resourceFactory, location, dateFilter, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.bankStatementDetails  = [];
            scope.formData = [];
            scope.inflowAmount = 0;
            scope.outflowAmount = 0;
            resourceFactory.bankStatementDetailsResource.getBankStatementDetails({ bankStatementId : routeParams.bankStatementId, command:'miscellaneous'},function (data) {
                    scope.bankStatementDetails = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewMiscellaneousBankStatementDetailsController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.ViewMiscellaneousBankStatementDetailsController]).run(function ($log) {
        $log.info("ViewMiscellaneousBankStatementDetailsController initialized");
    });
}(mifosX.controllers || {}));
