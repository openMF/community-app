(function(module) {
  mifosX.controllers = _.extend(module, {
    RoleController: function(scope, resourceFactory) {
      scope.roles = [];
      resourceFactory.roleResource.getAllRoles({}, function(data) {
        scope.roles = data;
      });
    }
  });
  mifosX.ng.application.controller('RoleController', ['$scope', 'ResourceFactory', mifosX.controllers.RoleController]).run(function($log) {
    $log.info("RoleController initialized"); 
  });
}(mifosX.controllers || {}));
