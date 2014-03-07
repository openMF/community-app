 (function(module) {
  mifosX.controllers = _.extend(module, {
    FixedDepositProductController: function(scope, resourceFactory,location) {
        scope.routeTo = function(id){
            location.path('/viewfixeddepositproduct/' + id);
        };
        resourceFactory.fixedDepositProductResource.getAllFixedDepositProducts(function(data) {
            scope.depositproducts = data;
        });

    }
  });
  mifosX.ng.application.controller('FixedDepositProductController', ['$scope', 'ResourceFactory','$location', mifosX.controllers.FixedDepositProductController]).run(function($log) {
    $log.info("FixedDepositProductController initialized");
  });
}(mifosX.controllers || {}));
