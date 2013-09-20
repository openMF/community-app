(function(module) {
  mifosX.controllers = _.extend(module, {
    MakeAccountTransferController: function(scope, resourceFactory, location, routeParams) {

      var params = {fromAccountId : routeParams.accountId};
      var accountType = routeParams.accountType || '';
      if (accountType == 'fromsavings') params.fromAccountType = 2;
      else if (accountType == 'fromloans') params.fromAccountType = 1;
      else params.fromAccountType = 0;

      scope.toOffices = [];
      scope.toClients = [];
      scope.toAccountTypes = [];
      scope.toAccounts = [];

      scope.formData = {fromAccountId:params.fromAccountId, fromAccountType:params.fromAccountType};
      resourceFactory.accountTransfersTemplateResource.get(params, function(data){
        scope.transfer = data;
        scope.toOffices = data.toOfficeOptions;
        scope.toAccountTypes = data.toAccountTypeOptions;
      });

      scope.changeEvent = function () {
        
        var params = scope.formData;
        delete params.transferAmount;
        delete params.transferDate;
        delete params.transferDescription;

        resourceFactory.accountTransfersTemplateResource.get(params, function(data){
          scope.transfer = data;
          scope.toOffices = data.toOfficeOptions;
          scope.toAccountTypes = data.toAccountTypeOptions;
          scope.toClients = data.toClientOptions;
          scope.toAccounts = data.toAccountOptions;
        });
      };

      scope.submit = function() {
        this.formData.locale = "en";
        this.formData.dateFormat = "dd MMMM yyyy";
        this.formData.fromOfficeId = scope.transfer.fromClient.id;
        this.formData.fromClientId = scope.transfer.fromClient.officeId;
        resourceFactory.accountTransferResource.save(this.formData,function(data){
          location.path('/viewsavingaccount/' + data.savingsId);
        });
      };
    }
  });
  mifosX.ng.application.controller('MakeAccountTransferController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.MakeAccountTransferController]).run(function($log) {
    $log.info("MakeAccountTransferController initialized");
  });
}(mifosX.controllers || {}));