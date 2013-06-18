(function() {
  require.config({
    paths: {
      'angular':       '../lib/angular/angular',
      'angular-mocks': '../lib/angular/angular-mocks',
      'underscore':    '../lib/underscore/underscore',
      'webstorage':    '../lib/angular-webstorage',
      'test':          '../test/functional'
    },
    shim: {
      'angular': {
        exports: 'angular'
      },
      'webstorage': {
        deps: ['angular']
      },
      'mifosX': {
        deps: ['angular', 'webstorage']
      }
    },
  });

  require(['mifosXComponents', 'mifosX', 'underscore'], function(components) {
    var dependencies = _.reduce(_.keys(components), function(list, group) {
      return list.concat(_.map(components[group], function(name) { return group + "/" + name; }));
    }, [
      'routes',
      'webstorage-configuration',
      'test/test_scenario_loader'
    ]);

    require(dependencies, function() {
      angular.bootstrap(document, ['MifosX_Application']);
    });
  });
}());
