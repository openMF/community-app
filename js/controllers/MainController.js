(function(module) {
  mifosX.controllers = _.extend(module, {
    MainController: function(scope, location, webStorage) {
      scope.$on("UserAuthenticationSuccessEvent", function(event, data) {
        webStorage.add("authenticationKey", data.base64EncodedAuthenticationKey);
        scope.currentUser = new mifosX.models.User(data);
        location.path('/home').replace();
      });
    }
  });
  mifosX.ng.application.controller('MainController', ['$scope', '$location', 'webStorage', mifosX.controllers.MainController]).run(function($log) {
    $log.info("MainController initialized");
  });
}(mifosX.controllers || {}));
