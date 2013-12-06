(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientClosedSavingsAccountController: function(scope, resourceFactory, routeParams) {
        resourceFactory.clientAccountResource.get({clientId: routeParams.clientId} , function(data) {
            scope.clientAccounts = data;
        });

        scope.isSavingClosed = function(savingaccount) {
          if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" || 
            savingaccount.status.code === "savingsAccountStatusType.closed" ||
            savingaccount.status.code === "savingsAccountStatusType.rejected") {
            return true;
          } else{
             return false;
          }
        };
    }
  });
  mifosX.ng.application.controller('ClientClosedSavingsAccountController', ['$scope', 'ResourceFactory', '$routeParams', mifosX.controllers.ClientClosedSavingsAccountController]).run(function($log) {
    $log.info("ClientClosedSavingsAccountController initialized");
  });
}(mifosX.controllers || {}));
