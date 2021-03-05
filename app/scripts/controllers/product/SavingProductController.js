(function (module) {
    mifosX.controllers = _.extend(module, {
        SavingProductController: function (scope, resourceFactory, location) {
            scope.products = [];

            scope.routeTo = function (id) {
                location.path('/viewsavingproduct/' + id);
            };

            if (!scope.searchCriteria.savingP) {
                scope.searchCriteria.savingP = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.savingP || '';

            scope.onFilter = function () {
                scope.searchCriteria.savingP = scope.filterText;
                scope.saveSC();
            };

            scope.SavingsProductsPerPage = 15;
            resourceFactory.savingProductResource.getAllSavingProducts(function (data) {
                scope.savingproducts = data;
            });
        }
    });
    mifosX.ng.application.controller('SavingProductController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.SavingProductController]).run(function ($log) {
        $log.info("SavingProductController initialized");
    });
}(mifosX.controllers || {}));