(function(module) {
  mifosX.controllers = _.extend(module, {
    MainController: function(scope, location, sessionManager, translate) {
      scope.$on("UserAuthenticationSuccessEvent", function(event, data) {
        scope.currentSession = sessionManager.get(data);
        location.path('/home').replace();
      });

      scope.logout = function() {
        scope.currentSession = sessionManager.clear();
        location.path('/').replace();
      };

      scope.langs   = [{"name" : "English" , "code" : "en"},
                       {"name" : "Français", "code":"fr"},
                       {"name" : "Español", "code":"es"},
                       {"name" : "Português", "code":"pt"},
                       {"name" : "中文", "code":"zh"},
                       {"name" : "हिंदी", "code":"hn"} ,
                       ];

      scope.optlang = scope.langs[0];

      scope.changeLang = function (lang) {
          translate.uses(lang.code);
          scope.optlang = lang;
      };

      sessionManager.restore(function(session) {
        scope.currentSession = session;
      });
    }
  });
  mifosX.ng.application.controller('MainController', [
    '$scope',
    '$location',
    'SessionManager',
    '$translate',
    mifosX.controllers.MainController
  ]).run(function($log) {
    $log.info("MainController initialized");
  });
}(mifosX.controllers || {}));
