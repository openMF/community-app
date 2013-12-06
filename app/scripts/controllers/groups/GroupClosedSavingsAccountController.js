(function(module) {
  mifosX.controllers = _.extend(module, {
    GroupClosedSavingsAccountController: function(scope, resourceFactory, routeParams) {

        resourceFactory.groupAccountResource.get({groupId: routeParams.groupId} , function(data) {
            scope.groupAccounts = data;
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
  mifosX.ng.application.controller('GroupClosedSavingsAccountController', ['$scope', 'ResourceFactory', '$routeParams', mifosX.controllers.GroupClosedSavingsAccountController]).run(function($log) {
    $log.info("GroupClosedSavingsAccountController initialized");
  });
}(mifosX.controllers || {}));
