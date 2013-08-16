(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewClientController: function(scope, routeParams , resourceFactory ) {
        scope.client = [];
        resourceFactory.clientResource.get({clientId: routeParams.id} , function(data) {
            scope.client = data;
        })
        resourceFactory.clientAccountResource.get({clientId: routeParams.id} , function(data) {
            scope.clientAccounts = data;
        })
        resourceFactory.clientNotesResource.getAllNotes({clientId: routeParams.id} , function(data) {
            scope.clientNotes = data;
        })

    }
  });
  mifosX.ng.application.controller('ViewClientController', ['$scope', '$routeParams','ResourceFactory', mifosX.controllers.ViewClientController]).run(function($log) {
    $log.info("ViewClientController initialized");
  });
}(mifosX.controllers || {}));
