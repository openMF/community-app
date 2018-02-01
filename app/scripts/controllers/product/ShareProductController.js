(function (module) {
    mifosX.controllers = _.extend(module, {
        ShareProductController: function (scope, resourceFactory, location) {
            scope.shareproducts = [];

            scope.routeTo = function (id) {
                location.path('/viewshareproduct/' + id);
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

            scope.ShareProductsPerPage = 15;

            scope.$broadcast('ShareProductDataLoadingStartEvent');
            resourceFactory.shareProduct.getAll(function(data) {
                scope.shareproducts = data;
                scope.$broadcast('ShareProductDataLoadingCompleteEvent');
            });
        }
    });
    mifosX.ng.application.controller('ShareProductController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ShareProductController]).run(function ($log) {
        $log.info("ShareProductController initialized");
    });
}(mifosX.controllers || {}));