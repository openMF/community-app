(function(module) {
  mifosX.controllers = _.extend(module, {
    LoanProductController: function(scope, resourceFactory) {

        scope.clients = [];
        scope.loanproducts = resourceFactory.loanProductResource.getAllLoanProducts();

    }
  });
  mifosX.ng.application.controller('LoanProductController', ['$scope', 'ResourceFactory', mifosX.controllers.LoanProductController]).run(function($log) {
    $log.info("LoanProductController initialized");
  });
}(mifosX.controllers || {}));
