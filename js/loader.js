(function() {
  require.config({
    paths: {
      'jquery':           '../lib/jquery/jquery-1.10.2',
      'jquery-ui':        '../lib/jquery-ui/jquery-ui-1.10.3.custom',
      'data-tables':      '../lib/data-tables/jquery.dataTables',
      'angular':          '../lib/angular/angular',
      'angular-resource': '../lib/angular/angular-resource',
      'angular-mocks':    '../lib/angular/angular-mocks',
      'underscore':       '../lib/underscore/underscore',
      'webstorage':       '../lib/angular-webstorage',
      'require-css':      '../lib/require-css',
      'require-less':     '../lib/require-less',
      'styles':           '../stylesheets',
      'test':             '../test/functional',
    },
    shim: {
      'angular': { exports: 'angular' },
      'angular-resource': { deps: ['angular'] },
      'angular-mocks': { deps: ['angular'] },
      'webstorage': { deps: ['angular'] },
      'jquery-ui': { deps: ['jquery'] },
      'mifosX': {
        deps: ['angular', 'angular-resource', 'webstorage', 'data-tables', 'jquery-ui'],
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
