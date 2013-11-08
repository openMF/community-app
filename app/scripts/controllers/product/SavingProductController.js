 (function(module) {
  mifosX.controllers = _.extend(module, {
    SavingProductController: function(scope, resourceFactory) {

        scope.products = [];
        resourceFactory.savingProductResource.getAllSavingProducts(function(data) {
            scope.savingproducts = data;
        });

    }
  });
  mifosX.ng.application.controller('SavingProductController', ['$scope', 'ResourceFactory', mifosX.controllers.SavingProductController]).run(function($log) {
    $log.info("SavingProductController initialized");
  });
}(mifosX.controllers || {}));
