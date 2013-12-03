(function(module) {
  mifosX.controllers = _.extend(module, {
    SearchController: function(scope, routeParams , resourceFactory) {
        
        scope.searchResults = [];
        resourceFactory.globalSearch.search( {query: routeParams.query} , function(data){
            scope.searchResults = data;
            if(scope.searchResults.length<=0){
                scope.flag = true;
            }
        });
        scope.getClientDetails = function(clientId) {

            scope.selected = clientId;
            resourceFactory.clientResource.get({clientId:clientId} , function(data) {
              scope.group = '';
              scope.client = data;
              scope.center = '';
            });
            resourceFactory.clientAccountResource.get({clientId: clientId} , function(data) {
              scope.clientAccounts = data;
            });
        };

        scope.getGroupDetails = function(groupId) { 

            scope.selected = groupId;

            resourceFactory.groupResource.get({groupId:groupId} , function(data) {
              scope.client = '';
              scope.center = '';
              scope.group = data;
            });
            resourceFactory.groupAccountResource.get({groupId: groupId} , function(data) {
              scope.groupAccounts = data;
            });
        };

        scope.getCenterDetails = function(centerId) {

            scope.selected = centerId;

            resourceFactory.centerResource.get({centerId: centerId,associations:'groupMembers'} , function(data) {
                scope.client = '';
                scope.group ='';
                scope.center = data;
            });
            resourceFactory.centerAccountResource.get({centerId: centerId} , function(data) {
                scope.centerAccounts = data;
            });
        };

     }
  });
  mifosX.ng.application.controller('SearchController', ['$scope','$routeParams','ResourceFactory', mifosX.controllers.SearchController]).run(function($log) {
    $log.info("SearchController initialized");
  });
}(mifosX.controllers || {}));
