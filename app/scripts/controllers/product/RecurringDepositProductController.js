 (function(module) {
  mifosX.controllers = _.extend(module, {
    RecurringDepositProductController: function(scope, resourceFactory,location) {
        scope.routeTo = function(id){
            location.path('/viewrecurringdepositproduct/' + id);
        };
        resourceFactory.recurringDepositProductResource.getAllRecurringDepositProducts(function(data) {
            scope.depositproducts = data;
        });

    }
  });
  mifosX.ng.application.controller('RecurringDepositProductController', ['$scope', 'ResourceFactory','$location', mifosX.controllers.RecurringDepositProductController]).run(function($log) {
    $log.info("RecurringDepositProductController initialized");
  });
}(mifosX.controllers || {}));
