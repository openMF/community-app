(function (module) {
    mifosX.controllers = _.extend(module, {
        UserSettingController: function (scope, translate, localStorageService, tmhDynamicLocale) {
            if (localStorageService.get('Language')) {
                var temp = localStorageService.get('Language');
                for (var i in mifosX.models.Langs) {
                    if (mifosX.models.Langs[i].code == temp.code) {
                        scope.optlang = mifosX.models.Langs[i];
                        tmhDynamicLocale.set(mifosX.models.Langs[i].code);
                    }
                }
            } else {
                scope.optlang = scope.langs[0];
                tmhDynamicLocale.set(scope.langs[0].code);
            }
            translate.uses(scope.optlang.code);
            scope.dates = [
                'dd MMMM yyyy',
                'dd/MMMM/yyyy',
                'dd-MMMM-yyyy',
                'MMMM-dd-yyyy',
                'MMMM dd yyyy',
                'MMMM/dd/yyyy'
            ];
            scope.$watch(function () {
                return scope.dateformat;
            }, function () {
                localStorageService.add('dateformat', scope.dateformat);
                scope.df = scope.dateformat;
            });
            scope.langs = mifosX.models.Langs;
            scope.changeLang = function (lang) {
                translate.uses(lang.code);
                localStorageService.add('Language', scope.optlang);
                tmhDynamicLocale.set(lang.code);
            };

        }
    });

    mifosX.ng.application.controller('UserSettingController', ['$scope', '$translate', 'localStorageService', 'tmhDynamicLocale', mifosX.controllers.UserSettingController]).run(function ($log) {
        $log.info("UserSettingController initialized");
    });
}(mifosX.controllers || {}));