(function(module) {
  mifosX.services = _.extend(module, {
    AuthenticationService: function(scope, http) {
      var onSuccess = function(data) {
        scope.$broadcast("UserAuthenticationSuccessEvent", data);
      };

      var onFailure = function(data) {
        scope.$broadcast("UserAuthenticationFailureEvent", data);
      };

      this.authenticateWithUsernamePassword = function(credentials) {
        http.post("/authentication?username=" + credentials.username + "&password=" + credentials.password)
          .success(onSuccess)
          .error(onFailure);
      };
    }
  });
  mifosX.ng.services.service('AuthenticationService', ['$rootScope', '$http', mifosX.services.AuthenticationService]).run(function($log) {
    $log.info("AuthenticationService initialized");
  });
}(mifosX.services || {}));
