(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewLoanCollateralController: function(scope, resourceFactory, routeParams, location) {

        scope.loanId = routeParams.loanId;
        scope.collateralId = routeParams.id;
        resourceFactory.loanResource.get({ resourceType:'collaterals', loanId:scope.loanId, resourceId:scope.collateralId}, function(data) {
          scope.collateral = data;
        });

        scope.deleteCollateral = function () {
          resourceFactory.loanResource.delete({ resourceType:'collaterals', loanId:scope.loanId, resourceId:scope.collateralId}, {}, function(data) {
            location.path('/viewloanaccount/'+scope.loanId);
          });
        };
    }
  });
  mifosX.ng.application.controller('ViewLoanCollateralController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.ViewLoanCollateralController]).run(function($log) {
    $log.info("ViewLoanCollateralController initialized");
  });
}(mifosX.controllers || {}));
