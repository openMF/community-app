(function(module) {
  mifosX.controllers = _.extend(module, {
    RolesController: function(scope, resourceFactory) {
      scope.roles = [];
      resourceFactory.roleResource.get({}, function(data) {
        scope.roles = data;
      });
    }
  });
  mifosX.ng.application.controller('RoleController', ['$scope', 'ResourceFactory', mifosX.controllers.RoleController]).run(function($log) {
    $log.info("RoleController initialized"); 
  });
}(mifosX.controllers || {}));
