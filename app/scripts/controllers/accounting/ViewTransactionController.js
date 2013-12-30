(function(module) {
  mifosX.controllers = _.extend(module, {

    ViewTransactionController: function(scope, routeParams, resourceFactory, location) {
      scope.flag=false;
      resourceFactory.journalEntriesResource.get({transactionId : routeParams.transactionId}, function(data){
        scope.transactionNumber = routeParams.transactionId;
        scope.transactions = data.pageItems;
          for(var i in data.pageItems){
              if(data.pageItems[i].reversed==false){
                  scope.flag = true;
              }
          }
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
