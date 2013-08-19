(function(module) {
  mifosX.controllers = _.extend(module, {
    UserSettingController: function(scope, translate) {
      
      

      scope.langs   = [{"name" : "English" , "code" : "en"},
                       {"name" : "French", "code":"fr"},
                       {"name" : "Spanish", "code":"es"},
                       {"name" : "Portuguese", "code":"pt"},
                       {"name" : "Chinese", "code":"zh"},  
                       ];

      scope.optlang = scope.langs[0];                       

      scope.changeLang = function (lang) {
          translate.uses(lang.code);
          scope.optlang = lang;
      };

    }
  });

  mifosX.ng.application.controller('UserSettingController', ['$scope', '$translate', mifosX.controllers.UserSettingController]).run(function($log) {
    $log.info("UserSettingController initialized");
  });
}(mifosX.controllers || {}));