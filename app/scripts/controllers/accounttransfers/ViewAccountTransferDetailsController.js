(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewAccountTransferDetailsController: function(scope, resourceFactory, location, routeParams) {

      resourceFactory.accountTransferResource.get({transferId:routeParams.id}, function(data){
        scope.transferData = data;
      });
    }
  });
  mifosX.ng.application.controller('ViewAccountTransferDetailsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.ViewAccountTransferDetailsController]).run(function($log) {
    $log.info("ViewAccountTransferDetailsController initialized");
  });
}(mifosX.controllers || {}));
