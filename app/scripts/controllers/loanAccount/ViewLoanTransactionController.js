(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewLoanTransactionController: function(scope, resourceFactory, location, routeParams, dateFilter) {

      resourceFactory.loanTrxnsResource.get({loanId:routeParams.accountId, transactionId:routeParams.id}, function(data){
        scope.transaction = data;
        scope.transaction.accountId = routeParams.accountId;
      });

      scope.undoTransaction = function(accountId, transactionId) {
        var params = {loanId:accountId, transactionId:transactionId, command:'undo'};
        var formData = {dateFormat:scope.df, locale:scope.optlang.code, transactionAmount:0};
        formData.transactionDate = dateFilter(new Date(),scope.df);
        resourceFactory.loanTrxnsResource.save(params, formData, function(data){
          location.path('/viewloanaccount/' + data.loanId);
        });
      };
    }
  });
  mifosX.ng.application.controller('ViewLoanTransactionController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ViewLoanTransactionController]).run(function($log) {
    $log.info("ViewLoanTransactionController initialized");
  });
}(mifosX.controllers || {}));
