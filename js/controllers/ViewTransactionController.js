(function(module) {
  mifosX.controllers = _.extend(module, {

    ViewTransactionController: function(scope, routeParams, resourceFactory, location) {

      resourceFactory.journalEntriesResource.get({transactionId : routeParams.transactionId}, function(data){
        scope.transactionNumber = routeParams.transactionId;
        scope.transactions = data.pageItems;
      });

      scope.reverseTransaction = function (transactionId) {

        resourceFactory.journalEntriesResource.reverse({transactionId : transactionId},function(data){
          location.path('/viewtransactions/'+data.transactionId);
        });
      }

    }
  });
  mifosX.ng.application.controller('ViewTransactionController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.ViewTransactionController]).run(function($log) {
    $log.info("ViewTransactionController initialized");
  });
}(mifosX.controllers || {}));
