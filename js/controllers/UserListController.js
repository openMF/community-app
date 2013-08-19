(function(module) {
  mifosX.controllers = _.extend(module, {
    UserListController: function(scope, resourceFactory) {
        scope.users = [];
        resourceFactory.userListResource.getAllUsers(function(data) {
            scope.users = data;
        });
    }
  });
  mifosX.ng.application.controller('UserListController', ['$scope', 'ResourceFactory', mifosX.controllers.UserListController]).run(function($log) {
    $log.info("UserListController initialized");
  });
}(mifosX.controllers || {}));
