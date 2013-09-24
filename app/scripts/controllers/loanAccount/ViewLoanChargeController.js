(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewLoanChargeController: function(scope, resourceFactory, routeParams, location) {

        scope.loanId =routeParams.loanId;
        scope.chargeId =routeParams.id;
        if (routeParams.loanstatus == 'Submitted and pending approval') {
          scope.showEditButtons = true;
        }
        if (routeParams.loanstatus == 'Active') {
          scope.showWaiveButton = true;
        }
        resourceFactory.loanResource.get({ resourceType:'charges', loanId:scope.loanId, resourceId:scope.chargeId}, function(data) {
          scope.charge = data;
        });

        scope.deleteCharge = function () {
          resourceFactory.loanResource.delete({ resourceType:'charges', loanId:scope.loanId, resourceId:scope.chargeId}, {}, function(data) {
            location.path('/viewloanaccount/'+scope.loanId);
          });
        };
        scope.waiveCharge = function () {
          resourceFactory.loanResource.save({ resourceType:'charges', loanId:scope.loanId, resourceId:scope.chargeId}, {}, function(data) {
            location.path('/viewloanaccount/'+scope.loanId);
          });
        };

    }
  });
  mifosX.ng.application.controller('ViewLoanChargeController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.ViewLoanChargeController]).run(function($log) {
    $log.info("ViewLoanChargeController initialized");
  });
}(mifosX.controllers || {}));
