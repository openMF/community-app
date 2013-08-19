(function() {
  require.config({
    paths: {
      'jquery':           '../lib/jquery/jquery',
      'jquery-ui':        '../lib/jquery-ui/ui/jquery-ui',
      'data-tables':      '../lib/datatables/media/js/jquery.dataTables',
      'blockUI':          '../lib/blockui/jquery.blockUI',
      'angular':          '../lib/angular/angular',
      'angular-resource': '../lib/angular-resource/angular-resource',
      'angular-translate': '../lib/angular-translate/angular-translate',
      'angular-translate-loader-static-files': '../lib/angular-translate-loader-static-files/angular-translate-loader-static-files',
      'angular-mocks':    '../lib/angular-mocks/angular-mocks',
      'angularui':        '../lib/angular-bootstrap/ui-bootstrap',
      'angularuitpls':    '../lib/angular-bootstrap/ui-bootstrap-tpls',
      'underscore':       '../lib/underscore/underscore',
      'webstorage':       '../lib/angular-webstorage/angular-webstorage',
      'require-css':      '../lib/require-css/css',
      'require-less':     '../lib/require-less/less',
      'styles':           '../stylesheets',
      'test':             '../test/functional'
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
      'mifosX': {
        deps: [
          'angular',
          'angular-resource',
          'angular-translate',
          'angular-translate-loader-static-files',
          'angularui',
          'angularuitpls',          
          'webstorage',
          'data-tables',
          'blockUI',
          'jquery-ui'
        ],
        exports: 'mifosX'
      }
    },
    packages: [
      {
        name: 'css',
        location: '../lib/require-css',
        main: 'css'
      },
      {
        name: 'less',
        location: '../lib/require-less',
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
