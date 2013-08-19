(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewUserController: function(scope, routeParams , resourceFactory ) {
        scope.user = [];
        resourceFactory.userListResource.get({userId: routeParams.id} , function(data) {
            scope.user = data;
        });
    }
  });
  mifosX.ng.application.controller('ViewUserController', ['$scope', '$routeParams','ResourceFactory', mifosX.controllers.ViewUserController]).run(function($log) {
    $log.info("ViewUserController initialized");
  });
}(mifosX.controllers || {}));
