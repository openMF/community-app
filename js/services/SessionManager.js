(function(module) {
  mifosX.services = _.extend(module, {
    SessionManager: function(webStorage, httpService, resourceFactory) {
      var EMPTY_SESSION = {};

      this.startSession = function(data) {
        webStorage.add("sessionData", {userId: data.userId, authenticationKey: data.base64EncodedAuthenticationKey});
        httpService.setAuthorization(data.base64EncodedAuthenticationKey);
        return {user: new mifosX.models.User(data)};
      }

      this.clearSession = function() {
        webStorage.remove("sessionData");
        httpService.cancelAuthorization();
        return EMPTY_SESSION;
      };

      this.restoreSession = function(handler) {
        var sessionData = webStorage.get('sessionData');
        if (sessionData !== null) {
          httpService.setAuthorization(sessionData.authenticationKey);
          var userData = resourceFactory.userResource.get({userId: sessionData.userId}, function() {
            handler({user: new mifosX.models.User(userData)});
          });
        } else {
          handler(EMPTY_SESSION);
        }
      };
    }
  });
  mifosX.ng.services.service('SessionManager', [
    'webStorage',
    'HttpService',
    'ResourceFactory',
    mifosX.services.SessionManager
  ]).run(function($log) {
    $log.info("SessionManager initialized");
  });
}(mifosX.services || {}));
