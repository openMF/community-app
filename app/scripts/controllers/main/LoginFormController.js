(function(module) {
  mifosX.controllers = _.extend(module, {
    LoginFormController: function(scope, authenticationService . httpProvider) {
      scope.loginCredentials = {};
      scope.authenticationFailed = false;
      
      $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = 'gk';

      scope.login = function() {
        authenticationService.authenticateWithUsernamePassword(scope.loginCredentials);
      };

      scope.$on("UserAuthenticationFailureEvent", function(data) {
        scope.authenticationFailed = true;
      });

    }
  });
  mifosX.ng.application.controller('LoginFormController', ['$scope', 'AuthenticationService','$httpProvider', mifosX.controllers.LoginFormController]).run(function($log) {
    $log.info("LoginFormController initialized");
  });
}(mifosX.controllers || {}));
