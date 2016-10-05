(function (module) {
    mifosX.controllers = _.extend(module, {
        CreditBureauLoanProductsController: function (scope, resourceFactory, location) {
            resourceFactory.loanProductResource.getAllCreditbureauLoanProducts({associations: 'creditBureaus'},function (data) {
                scope.creditbureauLoanProducts = data;
            });

            scope.routeTo = function (loanProductId) {
                location.path('/viewcreditbureauloanproduct/' + loanProductId);
            };

            if (!scope.searchCriteria.loanP) {
                scope.searchCriteria.loanP = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.loanP;

            scope.onFilter = function () {
                scope.searchCriteria.loanP = scope.filterText;
                scope.saveSC();
            };
        }
    });
    mifosX.ng.application.controller('CreditBureauLoanProductsController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreditBureauLoanProductsController]).run(function ($log) {
        $log.info("CreditBureauLoanProductsController initialized");
    });
}(mifosX.controllers || {}));