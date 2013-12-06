(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientClosedLoansAccountController: function(scope, resourceFactory, routeParams) {
        resourceFactory.clientAccountResource.get({clientId: routeParams.clientId} , function(data) {
            scope.clientAccounts = data;
        });

        scope.isClosed = function(loanaccount) {
          if(loanaccount.status.code === "loanStatusType.closed.written.off" ||
            loanaccount.status.code === "loanStatusType.closed.obligations.met" || 
            loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" || 
            loanaccount.status.code === "loanStatusType.withdrawn.by.client" || 
            loanaccount.status.code === "loanStatusType.rejected") {
            return true;
          } else{
             return false;
          }
        };
    }
  });
  mifosX.ng.application.controller('ClientClosedLoansAccountController', ['$scope', 'ResourceFactory', '$routeParams', mifosX.controllers.ClientClosedLoansAccountController]).run(function($log) {
    $log.info("ClientClosedLoansAccountController initialized");
  });
}(mifosX.controllers || {}));
