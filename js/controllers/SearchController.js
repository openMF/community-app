(function(module) {
  mifosX.controllers = _.extend(module, {
    SearchController: function(scope, routeParams , resourceFactory) {
        
        scope.searchResults = [];
        resourceFactory.globalSearch.search( {query: routeParams.query} , function(data){
            scope.searchResults = data;
        });
     }
  });
  mifosX.ng.application.controller('SearchController', ['$scope','$routeParams','ResourceFactory', mifosX.controllers.SearchController]).run(function($log) {
    $log.info("SearchController initialized");
  });
}(mifosX.controllers || {}));
