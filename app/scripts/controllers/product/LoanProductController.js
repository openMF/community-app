(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanProductController: function (scope, resourceFactory, location) {
            scope.products = [];

            scope.routeTo = function (id) {
                location.path('/viewloanproduct/' + id);
            };

            if (!scope.searchCriteria.loanP) {
                scope.searchCriteria.loanP = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.loanP || '';

            scope.onFilter = function () {
                scope.searchCriteria.loanP = scope.filterText;
                scope.saveSC();
            };

            scope.LoanProductsPerPage = 15;
            scope.$broadcast('LoanProductDataLoadingStartEvent');
            resourceFactory.loanProductResource.getAllLoanProducts(function (data) {
                scope.loanproducts = data;
                scope.$broadcast('LoanProductDataLoadingCompleteEvent');
            });
        }
    });
    mifosX.ng.application.controller('LoanProductController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.LoanProductController]).run(function ($log) {
        $log.info("LoanProductController initialized");
    });
}(mifosX.controllers || {}));