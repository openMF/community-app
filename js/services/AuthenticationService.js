(function(module) {
  mifosX.services = _.extend(module, {
    AuthenticationService: function(scope, httpService) {
      var onSuccess = function(data) {
        scope.$broadcast("UserAuthenticationSuccessEvent", data);
      };

      var onFailure = function(data) {
        scope.$broadcast("UserAuthenticationFailureEvent", data);
      };

      this.authenticateWithUsernamePassword = function(credentials) {
        httpService.post("/authentication?username=" + credentials.username + "&password=" + credentials.password)
          .success(onSuccess)
          .error(onFailure);
      };
    }
  });
  mifosX.ng.services.service('AuthenticationService', ['$rootScope', 'HttpService', mifosX.services.AuthenticationService]).run(function($log) {
    $log.info("AuthenticationService initialized");
  });
}(mifosX.services || {}));
