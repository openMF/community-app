(function(module) {
  mifosX.controllers = _.extend(module, {
    UserController: function(scope, resourceFactory) {
      scope.users = [];
      resourceFactory.userResource.getAllUsers({fields: "id,firstname,lastname,username,officeName"}, function(data) {
        scope.users = data;
      });
    }
  });
  mifosX.ng.application.controller('UserController', ['$scope', 'ResourceFactory', mifosX.controllers.UserController]).run(function($log) {
    $log.info("UserController initialized");
  });
}(mifosX.controllers || {}));