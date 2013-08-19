(function(module) {
  mifosX.controllers = _.extend(module, {
    UserSettingController: function(scope, translate) {
      scope.changeLanguage = function (langKey) {
        translate.uses(langKey);
      };
    }
  });
  mifosX.ng.application.controller('UserSettingController', ['$scope', '$translate', mifosX.controllers.UserSettingController]).run(function($log) {
    $log.info("UserSettingController initialized");
  });
}(mifosX.controllers || {}));