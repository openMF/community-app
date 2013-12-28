(function(module) {
  mifosX.controllers = _.extend(module, {
    LoanProductController: function(scope, resourceFactory,location) {
        scope.routeTo = function(id){
            location.path('/viewloanproduct/' + id);
        };
        scope.products = [];
        scope.$broadcast('LoanProductDataLoadingStartEvent');
        resourceFactory.loanProductResource.getAllLoanProducts(function(data) {
            scope.loanproducts = data;
			      scope.$broadcast('LoanProductDataLoadingCompleteEvent');
        });

    }
  });
  mifosX.ng.application.controller('LoanProductController', ['$scope', 'ResourceFactory','$location', mifosX.controllers.LoanProductController]).run(function($log) {
    $log.info("LoanProductController initialized");
  });
}(mifosX.controllers || {}));
