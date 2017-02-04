// Karma configuration

module.exports = function (config) {
    config.set({
        basePath : '',

        frameworks : ["jasmine"],

        files : [
        './app/bower_components/angular/angular.js',
        './app/bower_components/angular-mocks/angular-mocks.js',
        './app/bower_components/underscore/underscore-min.js',
        './app/bower_components/requirejs/require.js',
        './app/scripts/mifosX.js',
        './app/scripts/models/*.js',
        './app/scripts/services/*.js',
        './app/scripts/directives/*.js',
        './app/scripts/controllers/**/*.js',
        './test/spec/**/*.js'
        ],

        // list of files to exclude
        exclude : [],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters : ['progress', 'coverage'],

        preprocessors: {
          './app/scripts/**/*.js' : ['coverage']
        },

        junitReporter : {
            outputFile: 'karma-reports/test-unit.xml',
            suite: 'unit'
        },

        coverageReporter: {
          reporters:[
            {type : 'cobertura', dir : 'karma-reports/'},
            {type : 'text',      dir : 'karma-reports/', file : 'coverage.txt'},
            {type : 'html',      dir : 'karma-reports/' }
          ]
        },

        // web server port
        port : 8080,


        // cli runner port
        runnerPort : 9100,

        // enable / disable colors in the output (reporters and logs)
        colors : true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel : config.LOG_INFO,

        autoWatch : false,

        browsers : ['PhantomJS2'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout : 5000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun : true
    });
}






