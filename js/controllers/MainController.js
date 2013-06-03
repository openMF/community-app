(function(module) {
  mifosX.controllers = _.extend(module, {
    MainController: function(scope, location) {
      scope.$on("UserAuthenticationSuccessEvent", function(event, data) {
        scope.currentUser = new mifosX.models.User(data);
        location.path('/home').replace();
      });
    }
  });
  mifosX.ng.application.controller('MainController', ['$scope', '$location', mifosX.controllers.MainController]).run(function($log) {
    $log.info("MainController initialized");
  });
}(mifosX.controllers || {}));
