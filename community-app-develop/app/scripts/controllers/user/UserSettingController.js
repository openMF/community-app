(function (module) {
    mifosX.controllers = _.extend(module, {
        UserSettingController: function (scope, translate, localStorageService, tmhDynamicLocale) {

            
            scope.dates = [
                'dd MMMM yyyy',
                'dd/MMMM/yyyy',
                'dd-MMMM-yyyy',
                'dd-MM-yy',
                'MMMM-dd-yyyy',
                'MMMM dd yyyy',
                'MMMM/dd/yyyy',
                'MM-dd-yy',
                'yyyy-MM-dd'
            ];

            scope.langs = mifosX.models.Langs;
            

            scope.$watch(function () {
                return scope.df;
            }, function () {
                scope.updateDf(scope.df);
            });

            scope.$watch(function () {
                return scope.optlang;
            }, function () {
                scope.changeLang(scope.optlang);
            });


        }
    });

    mifosX.ng.application.controller('UserSettingController', ['$scope', '$translate', 'localStorageService', 'tmhDynamicLocale', mifosX.controllers.UserSettingController]).run(function ($log) {
        $log.info("UserSettingController initialized");
    });
}(mifosX.controllers || {}));