(function(module) {
  mifosX.services = _.extend(module, {
    AuthenticationService: function(scope, http) {
      var onSuccess = function(response) {
        scope.$broadcast("UserAuthenticationSuccessEvent", response.data);
      };

      var onFailure = function(response) {
        scope.$broadcast("UserAuthenticationFailureEvent", response.data);
      };

      this.authenticateWithUsernamePassword = function(credentials) {
        //temporary stub authentication
        var roles = {
          mifos: [{id: 1, name: "Super User"}],
          joe: [{id: 2, name: "Branch Manager"}],
          jack: [{id: 3, name: "Funder"}]
        };
        if (credentials.password === 'password') {
          var role = roles[credentials.username];
          if (role) {
            onSuccess({
              data: {
                username: credentials.username,
                userId: 1,
                base64EncodedAuthenticationKey: "bWlmb3M6cGFzc3dvcmQ=",
                authenticated: true,
                roles: role,
                permissions: [ "ALL_FUNCTIONS" ]
              }
            });
          }
        } else {
          onFailure({});
        }

        // http.post("/authentication?username=" + credentials.username + "&password=" + credentials.password)
        //   .success(onSuccess)
        //   .error(onFailure);
      };
    }
  });
  mifosX.ng.services.service('AuthenticationService', ['$rootScope', '$http', mifosX.services.AuthenticationService]).run(function($log) {
    $log.info("AuthenticationService initialized");
  });
}(mifosX.services || {}));
