// Karma configuration

module.exports = function (config) {
    config.set({
        basePath : '',

        frameworks : ["jasmine"],

        files : [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/underscore/underscore-min.js',
        'app/bower_components/requirejs/require.js',
        'app/scripts/mifosX.js',
        'app/scripts/models/roleMap.js',
        'app/scripts/models/LoggedInUser.js',
        'app/scripts/models/Role.js',
        'app/scripts/models/Langs.js',
        'app/scripts/services/AuthenticationService.js',
        'app/scripts/services/SessionManager.js',
        'app/scripts/services/HttpServiceProvider.js',
        'app/scripts/services/ResourceFactoryProvider.js',
        'app/scripts/directives/DataTablesDirective.js',
        'app/scripts/directives/OverlayDirective.js',
        'app/scripts/directives/DialogDirective.js',
        'app/scripts/controllers/main/MainController.js',
        'app/scripts/controllers/main/LoginFormController.js',
        'app/scripts/controllers/organization/RoleController.js',
        'app/scripts/controllers/user/UserController.js',
        'app/scripts/controllers/user/UserFormController.js',
        'app/scripts/controllers/user/UserListController.js',
        'app/scripts/controllers/client/ClientController.js',
        'app/scripts/controllers/user/UserSettingController.js',
        'app/scripts/controllers/main/SearchController.js',
//        'app/scripts/**/*.js',
        'test/spec/**/*.js'
        ],

        // list of files to exclude
        exclude : [],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters : ['progress'],

        // web server port
        port : 8080,


        // cli runner port
        runnerPort : 9100,

        // enable / disable colors in the output (reporters and logs)
        colors : true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel : LOG_INFO,

        autoWatch : false,

        browsers : ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout : 5000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun : true
    });
}






