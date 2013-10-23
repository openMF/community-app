(function() {
    require.config({
        paths: {
            'jquery':           '../bower_components/jquery/jquery',
            'jquery-ui':        '../bower_components/jquery-ui/ui/jquery-ui',
            'data-tables':      '../bower_components/datatables/media/js/jquery.dataTables',
            'blockUI':          '../bower_components/blockui/jquery.blockUI',
            'angular':          '../bower_components/angular/angular',
            'angular-resource': '../bower_components/angular-resource/angular-resource',
            'angular-translate': '../bower_components/angular-translate/angular-translate',
            'angular-translate-loader-static-files': '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files',
            'angular-mocks':    '../bower_components/angular-mocks/angular-mocks',
            'angularui':        '../bower_components/angular-bootstrap/ui-bootstrap',
            'angularuitpls':    '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
            'underscore':       '../bower_components/underscore/underscore',
            'webstorage':       '../bower_components/angular-webstorage/angular-webstorage',
            'require-css':      '../bower_components/require-css/css',
            'require-less':     '../bower_components/require-less/less',
            'd3':               '../bower_components/d3/d3',
            'nvd3':             '../bower_components/nvd3/nv.d3',
            'nvd3ChartDirectives': '../scripts/directives/angularjs-nvd3-directives',
            'styles':           '../styles',
            'test':             '../../test/functional',
            'notificationWidget': '../scripts/modules/notificationWidget',
            'modified.datepicker': '../scripts/modules/datepicker',
            'angularFileUpload':   '../bower_components/angularjs-file-upload/angular-file-upload',
            'ngSanitize':       '../bower_components/angular-sanitize/angular-sanitize',
            'angularFileUpload':   '../bower_components/angularjs-file-upload/angular-file-upload',
            'ckEditor':         '../bower_components/ckeditor/ckeditor',
            'jquery.menu-aim'  :'../bower_components/jQuery-menu-aim/jquery.menu-aim'
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
            'jquery-ui': { deps: ['jquery'] },
            'd3': {exports: 'd3'},
            'nvd3': { deps: ['d3']},
            'nvd3ChartDirectives': {deps: ['angular','nvd3']},
            'notificationWidget':{deps: ['angular','jquery'],exports:'notificationWidget'},
            'angularFileUpload':{deps: ['angular','jquery'],exports:'angularFileUpload'},
            'modified.datepicker':{deps: ['angular']},
            'ngSanitize':{deps:['angular'],exports:'ngSanitize'},
            'ckEditor':{deps:['jquery']},
            'jquery.menu-aim':{deps:['jquery','jquery-ui']},
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
                    'data-tables',
                    'blockUI',
                    'jquery-ui',
                    'nvd3ChartDirectives',
                    'notificationWidget',
                    'angularFileUpload',
                    'modified.datepicker',
                    'ngSanitize',
                    'ckEditor',
                    'jquery.menu-aim'
                ],
                exports: 'mifosX'
            }
        },
        packages: [
            {
                name: 'css',
                location: '../bower_components/require-css',
                main: 'css'
            },
            {
                name: 'less',
                location: '../bower_components/require-less',
                main: 'less'
            }
        ]
    });

    require(['mifosXComponents', 'mifosXStyles'], function() {
        require(['test/testInitializer'], function(testMode) {
            if (!testMode) {
                angular.bootstrap(document, ["MifosX_Application"]);
            }
        });
    });
}());
