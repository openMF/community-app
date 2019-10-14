(function (module) {
    mifosX.controllers = _.extend(module, {
        FixedDepositProductController: function (scope, resourceFactory, location) {
            scope.routeTo = function (id) {
                location.path('/viewfixeddepositproduct/' + id);
            };

            if (!scope.searchCriteria.fdp) {
                scope.searchCriteria.fdp = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.fdp || '';

            scope.onFilter = function () {
                scope.searchCriteria.fdp = scope.filterText;
                scope.saveSC();
            };

            scope.FixedDepositsPerPage = 15;
            resourceFactory.fixedDepositProductResource.getAllFixedDepositProducts(function (data) {
                scope.depositproducts = data;
            });
        }
    });
    mifosX.ng.application.controller('FixedDepositProductController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.FixedDepositProductController]).run(function ($log) {
        $log.info("FixedDepositProductController initialized");
    });
}(mifosX.controllers || {}));