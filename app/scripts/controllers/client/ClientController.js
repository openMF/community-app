(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientController: function(scope, resourceFactory , paginatorService) {
        
      scope.clients = [];

      var fetchFunction = function(offset, limit, callback) {
        resourceFactory.clientResource.getAllClients({offset: offset, limit: limit} , callback);
      };
      
      scope.clients = paginatorService.paginate(fetchFunction, 14);
    }
  });
  mifosX.ng.application.controller('ClientController', ['$scope', 'ResourceFactory', 'PaginatorService', mifosX.controllers.ClientController]).run(function($log) {
    $log.info("ClientController initialized");
  });
}(mifosX.controllers || {}));
