(function() {
    require.config({
        paths: {
            'jquery':           '../bower_components/jquery/jquery.min',
            'angular':          '../bower_components/angular/angular.min',
            'angular-resource': '../bower_components/angular-resource/angular-resource.min',
            'angular-translate':'../bower_components/angular-translate/angular-translate.min',
            'angular-translate-loader-static-files':'../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min',
            'angular-mocks':    '../bower_components/angular-mocks/angular-mocks.min',
            'angularui':        '../bower_components/angular-bootstrap/ui-bootstrap.min',
            'angularuitpls':    '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
            'underscore':       '../bower_components/underscore/underscore.min',
            'webstorage':       '../bower_components/angular-webstorage/angular-webstorage.min',
            'require-css':      '../bower_components/require-css/css',
            'd3':               '../bower_components/d3/d3.min',
            'nvd3':             '../bower_components/nvd3/nv.d3.min',
            'nvd3ChartDirectives':'../scripts/modules/angularjs-nvd3-directives',
            'styles':           '../styles',
            'test':             '../test/functional',
            'notificationWidget':'../scripts/modules/notificationWidget',
            'modified.datepicker':'../scripts/modules/datepicker',
            'configurations':'../scripts/modules/configurations',
            'angularFileUpload':'../bower_components/angularjs-file-upload/angular-file-upload.min',
            'angularFileUploadShim':'../bower_components/angularjs-file-upload/angular-file-upload-shim.min',
            'ngSanitize':       '../bower_components/angular-sanitize/angular-sanitize.min',
            'ckEditor':         '../bower_components/ckeditor/ckeditor.min',
            'LocalStorageModule':'../scripts/modules/localstorage',
 			'ngCsv':            "../scripts/modules/csv",
            'chosen.jquery.min':   "../scripts/modules/chosen.jquery.min",
            'frAngular':        '../scripts/modules/KeyboardManager'
        },
        shim: {
            'angular': { exports: 'angular' },
            'angular-resource': { deps: ['angular'] },
            'angular-translate': { deps: ['angular'] },
            'angular-translate-loader-static-files': {deps: ['angular' , 'angular-translate'] },
            'angularui': { deps: ['angular'] },
            'angularuitpls': { deps: ['angular' ,'angularui' ] },
            'angular-mocks': { deps: ['angular'] },
            'webstorage': { deps: ['angular'] },
            'd3': {exports: 'd3'},
            'nvd3': { deps: ['d3']},
            'nvd3ChartDirectives': {deps: ['angular','nvd3']},
            'configurations':{deps: ['angular']},
            'notificationWidget':{deps: ['angular','jquery'],exports:'notificationWidget'},
            'angularFileUpload':{deps: ['angular','jquery','angularFileUploadShim'],exports:'angularFileUpload'},
            'modified.datepicker':{deps: ['angular']},
            'ngSanitize':{deps:['angular'],exports:'ngSanitize'},
            'ckEditor':{deps:['jquery']},
            'LocalStorageModule':{deps:['angular']},
            'ngCsv':{deps:['angular']},
            'chosen.jquery.min':{deps:['jquery']},
            'frAngular':{deps:['angular']},
            'mifosX': {
                deps: [
                    'angular',
                    'jquery',
                    'angular-resource',
                    'angular-translate',
                    'angular-translate-loader-static-files',
                    'angularui',
                    'angularuitpls',
                    'webstorage',
                    'nvd3ChartDirectives',
                    'notificationWidget',
                    'angularFileUpload',
                    'modified.datepicker',
                    'ngSanitize',
                    'ckEditor',
                    'configurations',
                    'LocalStorageModule',
                    'angularFileUploadShim',
                    'ngCsv',
                    'chosen.jquery.min',
                    'frAngular'
                ],
                exports: 'mifosX'
            }
        },
        packages: [
            {
                name: 'css',
                location: '../bower_components/require-css',
                main: 'css'
            }
        ]
    });

    require(['mifosXComponents.js', 'mifosXStyles.js'], function() {
        require(['test/testInitializer'], function(testMode) {
            if (!testMode) {
                angular.bootstrap(document, ['MifosX_Application']);
            }
        });
    });
}());
