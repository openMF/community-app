(function(module) {
  mifosX.controllers = _.extend(module, {
    UserController: function(scope, resourceFactory) {
      scope.users = [];
      scope.newUserFormDialog = function() {
        scope.$broadcast('OpenUserFormDialog', {title: 'New User'});
      };
      scope.$evalAsync(function() { scope.$broadcast('UserDataLoadingStartEvent'); });
      resourceFactory.userResource.getAllUsers({fields: "id,firstname,lastname,username,officeName"}, function(data) {
        scope.users = data;
        scope.$broadcast('UserDataLoadingCompleteEvent');
      });
    }
  });
  mifosX.ng.application.controller('UserController', ['$scope', 'ResourceFactory', mifosX.controllers.UserController]).run(function($log) {
    $log.info("UserController initialized");
  });
}(mifosX.controllers || {}));