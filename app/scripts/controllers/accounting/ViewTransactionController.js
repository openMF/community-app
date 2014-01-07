(function(module) {
  mifosX.controllers = _.extend(module, {

    ViewTransactionController: function(scope, routeParams, resourceFactory, location,route, $modal) {
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
        scope.confirmation = function () {
            $modal.open({
                templateUrl: 'confirmation.html',
                controller: ConfirmationCtrl,
                resolve: {
                    id: function () {
                        return scope.trxnid;
                    }
                }
            });
        };

        var ConfirmationCtrl = function ($scope, $modalInstance,id) {
            $scope.transactionnumber = id.transactionId;
            $scope.redirect = function () {
                location.path('/viewtransactions/'+id.transactionId);
                $modalInstance.close('delete');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
      scope.reverseTransaction = function (transactionId) {

        resourceFactory.journalEntriesResource.reverse({transactionId : transactionId},function(data){
            scope.trxnid = data;
            scope.confirmation();

            route.reload();

        });
      }

    }
  });
  mifosX.ng.application.controller('ViewTransactionController', ['$scope', '$routeParams', 'ResourceFactory', '$location','$route','$modal', mifosX.controllers.ViewTransactionController]).run(function($log) {
    $log.info("ViewTransactionController initialized");
  });
}(mifosX.controllers || {}));
