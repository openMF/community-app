(function(module) {
  mifosX.controllers = _.extend(module, {
    AllRolesController: function(scope, resourceFactory) {
      var allRolesData = resourceFactory.allRolesResource.get(function() {
        // scope.roles = new mifosX.models.User(userData);
        scope.allRoles = allRolesData;
      });
    }
  });

  mifosX.ng.application.controller('AllRolesController', [
    '$scope',
    'ResourceFactory',
    mifosX.controllers.AllRolesController
  ]).run(function($log) {
    $log.info("AllRolesController initialized");
  });
}(mifosX.controllers || {}));
