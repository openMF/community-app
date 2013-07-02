(function(module) {
  mifosX.controllers = _.extend(module, {
    MainController: function(scope, location, webStorage, httpService, resourceFactory) {
      scope.$on("UserAuthenticationSuccessEvent", function(event, data) {
        webStorage.add("userId", data.userId);
        webStorage.add("authenticationKey", data.base64EncodedAuthenticationKey);
        httpService.setAuthorization(data.base64EncodedAuthenticationKey);
        scope.currentUser = new mifosX.models.User(data);
        location.path('/home').replace();
      });

      if (webStorage.get("userId") !== null && webStorage.get("authenticationKey") !== null) {
        httpService.setAuthorization(webStorage.get("authenticationKey"));
        var userData = resourceFactory.userResource.get({userId: webStorage.get("userId")}, function() {
          scope.currentUser = new mifosX.models.User(userData);
        });
      }
    }
  });
  mifosX.ng.application.controller('MainController', [
    '$scope',
    '$location',
    'webStorage',
    'HttpService',
    'ResourceFactory',
    mifosX.controllers.MainController
  ]).run(function($log) {
    $log.info("MainController initialized");
  });
}(mifosX.controllers || {}));
