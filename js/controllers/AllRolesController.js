(function(module) {
  mifosX.controllers = _.extend(module, {
    AllRolesController: function(scope, resourceFactory) {
      resourceFactory.allRolesResource.get({}, function(allRolesData) {
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
