(function(module) {
  mifosX.controllers = _.extend(module, {
    UserController: function(scope, resourceFactory) {
      resourceFactory.userResource.getAllUsers({}, function(usersData) {
        scope.users = _.map(usersData, function(data) {return new mifosX.models.User(data);});
      });
    }
  });
  mifosX.ng.application.controller('UserController', ['$scope', 'ResourceFactory', mifosX.controllers.UserController]).run(function($log) {
    $log.info("UserController initialized");
  });
}(mifosX.controllers || {}));