(function(module) {
  mifosX.controllers = _.extend(module, {
    TaskController: function(scope, resourceFactory) {
        
        scope.clients = [];
        scope.loans = [];

        resourceFactory.clientResource.getAllClients(function(data) {
          scope.clients = data.pageItems;
        })
        resourceFactory.loanResource.getAllLoans(function(data) {
          scope.loans = data.pageItems;
        });

    }
  });
  mifosX.ng.application.controller('TaskController', ['$scope', 'ResourceFactory', mifosX.controllers.TaskController]).run(function($log) {
    $log.info("TaskController initialized");
  });
}(mifosX.controllers || {}));
