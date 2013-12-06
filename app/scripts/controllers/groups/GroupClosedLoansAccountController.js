(function(module) {
  mifosX.controllers = _.extend(module, {
    GroupClosedLoansAccountController: function(scope, resourceFactory, routeParams) {
        resourceFactory.groupAccountResource.get({groupId: routeParams.groupId} , function(data) {
            scope.groupAccounts = data;
        });

        scope.isLoanClosed = function(loanaccount) {
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
  mifosX.ng.application.controller('GroupClosedLoansAccountController', ['$scope', 'ResourceFactory', '$routeParams', mifosX.controllers.GroupClosedLoansAccountController]).run(function($log) {
    $log.info("GroupClosedLoansAccountController initialized");
  });
}(mifosX.controllers || {}));
