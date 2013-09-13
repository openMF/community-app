(function(module) {
  mifosX.controllers = _.extend(module, {
    AccCoaController: function(scope, resourceFactory) {
        scope.coadata = [];
        resourceFactory.accountCoaResource.getAllAccountCoas(function(data) {
            scope.coadatas = data;
        });
    }
  });
  mifosX.ng.application.controller('AccCoaController', ['$scope', 'ResourceFactory', mifosX.controllers.AccCoaController]).run(function($log) {
    $log.info("AccCoaController initialized");
  });
}(mifosX.controllers || {}));
