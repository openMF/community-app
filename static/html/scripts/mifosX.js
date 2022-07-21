var mifosX = (function (module) {
    module.ng = {
        config: angular.module('config_params', ['configurations']),
        services: angular.module('MifosX_Services', ['ngResource']),
        application: angular.module('MifosX_Application', ['MifosX_Services', 'config_params', 'webStorageModule', 'ui.bootstrap' , 'pascalprecht.translate', 'nvd3ChartDirectives', 'notificationWidget', 'ngFileUpload', 'modified.datepicker', 'ngRoute', 'ngSanitize', 'LocalStorageModule', 'ngIdle', 'ngCsv', 'frAngular', 'tmh.dynamicLocale', 'webcam', 'angularUtils.directives.dirPagination', 'ngScrollbar', 'mgo-angular-wizard','angularUtils.directives.dirPagination'])
    };
    return module;
}(mifosX || {}));
