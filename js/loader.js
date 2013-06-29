(function() {
  require.config({
    paths: {
      'angular':          '../lib/angular/angular',
      'angular-resource': '../lib/angular/angular-resource',
      'angular-mocks':    '../lib/angular/angular-mocks',
      'underscore':       '../lib/underscore/underscore',
      'webstorage':       '../lib/angular-webstorage',
      'test':             '../test/functional'
    },
    shim: {
      'angular': {
        exports: 'angular'
      },
      'angular-resource': {
        deps: ['angular']
      },
      'webstorage': {
        deps: ['angular']
      },
      'mifosX': {
        deps: ['angular', 'angular-resource', 'webstorage'],
        exports: 'mifosX'
      }
    },
  });

  require(['mifosXComponents', 'mifosX', 'underscore'], function(components) {
    var dependencies = _.reduce(_.keys(components), function(list, group) {
      return list.concat(_.map(components[group], function(name) { return group + "/" + name; }));
    }, [
      'test/test_scenario_loader',
      'routes',
      'webstorage-configuration'
    ]);

    require(dependencies, function(test) {
      if (!test) {
        angular.bootstrap(document, ["MifosX_Application"]);
      }
    });
  });
}());
