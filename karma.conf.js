// Karma configuration

module.exports = function (config) {
    config.set({
        basePath : '',

        // Fix for "JASMINE is not supported anymore" warning
        frameworks : ["jasmine", "requirejs"],

        files : [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/scripts/loader.js',
//        'app/scripts/*.js',
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

        browsers : ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout : 5000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun : true
    });
}






