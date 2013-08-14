(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientController: function(scope, resourceFactory) {
        scope.clients = [];
        resourceFactory.clientResource.getAllClients(function(data) {
            scope.clients = data;
        });
    }
  });
  mifosX.ng.application.controller('ClientController', ['$scope', 'ResourceFactory', mifosX.controllers.ClientController]).run(function($log) {
    $log.info("ClientController initialized");
  });
}(mifosX.controllers || {}));
