(function() {
  require.config({
    paths: {
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
      'mifosX': {
        deps: ['angular', 'angular-resource', 'webstorage'],
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
