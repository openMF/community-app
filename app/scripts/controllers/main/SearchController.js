(function(module) {
  mifosX.controllers = _.extend(module, {
    SearchController: function(scope, routeParams , resourceFactory) {
        
        scope.searchResults = [];
        resourceFactory.globalSearch.search( {query: routeParams.query} , function(data){
            scope.searchResults = data;
        });
        scope.getClientDetails = function(clientId) { 
            resourceFactory.clientResource.get({clientId:clientId} , function(data) {
              scope.group = '';
              scope.client = data;

            });
            resourceFactory.clientAccountResource.get({clientId: clientId} , function(data) {
              scope.clientAccounts = data;
            });
        }
        scope.getGroupDetails = function(groupId) { 
            resourceFactory.groupResource.get({groupId:groupId} , function(data) {
              scope.client = '';
              scope.group = data;
            });
            resourceFactory.groupAccountResource.get({groupId: groupId} , function(data) {
              scope.groupAccounts = data;
            });
        }
     }
  });
  mifosX.ng.application.controller('SearchController', ['$scope','$routeParams','ResourceFactory', mifosX.controllers.SearchController]).run(function($log) {
    $log.info("SearchController initialized");
  });
}(mifosX.controllers || {}));
