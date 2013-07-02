(function(module) {
  mifosX.controllers = _.extend(module, {
    MainController: function(scope, location, sessionManager) {
      scope.$on("UserAuthenticationSuccessEvent", function(event, data) {
        scope.currentSession = sessionManager.startSession(data);
        location.path('/home').replace();
      });

      scope.logout = function() {
        scope.currentSession = sessionManager.clearSession();
        location.path('/').replace();
      };

      sessionManager.restoreSession(function(session) {
        scope.currentSession = session;
      });
    }
  });
  mifosX.ng.application.controller('MainController', [
    '$scope',
    '$location',
    'SessionManager',
    mifosX.controllers.MainController
  ]).run(function($log) {
    $log.info("MainController initialized");
  });
}(mifosX.controllers || {}));
