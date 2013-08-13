(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientController: function(scope, resourceFactory) {

        scope.clients = [];
        console.log("inside controller");
        resourceFactory.clientResource.getAllClients(function(data) {
            console.log("Call success");
            scope.clients = data;
        });


    }
  });
  mifosX.ng.application.controller('ClientController', ['$scope', 'ResourceFactory', mifosX.controllers.ClientController]).run(function($log) {
    $log.info("ClientController initialized");
  });
}(mifosX.controllers || {}));
