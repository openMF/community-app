(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewSavingsTransactionController: function(scope, resourceFactory, location, routeParams, dateFilter) {

      resourceFactory.savingsTrxnsResource.get({savingsId:routeParams.accountId, transactionId:routeParams.id}, function(data){
        scope.transaction = data;
      });

      scope.undoTransaction = function(accountId, transactionId) {
        var params = {savingsId:accountId, transactionId:transactionId, command:'undo'};
        var formData = {dateFormat:'dd MMMM yyyy', locale:'en', transactionAmount:0};
        formData.transactionDate = dateFilter(new Date(),'dd MMMM yyyy');
        resourceFactory.savingsTrxnsResource.save(params, formData, function(data){
          location.path('/viewsavingaccount/' + data.savingsId);
        });
      };
    }
  });
  mifosX.ng.application.controller('ViewSavingsTransactionController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ViewSavingsTransactionController]).run(function($log) {
    $log.info("ViewSavingsTransactionController initialized");
  });
}(mifosX.controllers || {}));
