(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewUserController: function(scope, routeParams, location, resourceFactory ) {
        scope.user = [];
        resourceFactory.userListResource.get({userId: routeParams.id} , function(data) {
            scope.user = data;
        });

        scope.deleteuser = function (){
          resourceFactory.userListResource.delete({userId: routeParams.id} , {} , function(data) {
                location.path('/userslist');
                // added dummy request param because Content-Type header gets removed 
                // if the request does not contain any data (a request body)        
          });
        };
    }
  });
  mifosX.ng.application.controller('ViewUserController', ['$scope', '$routeParams', '$location', 'ResourceFactory', mifosX.controllers.ViewUserController]).run(function($log) {
    $log.info("ViewUserController initialized");
  });
}(mifosX.controllers || {}));
