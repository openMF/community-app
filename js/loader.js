(function() {
  require.config({
    paths: {
      angular: '../lib/angular/angular',
      underscore: '../lib/underscore/underscore',
      test: '../test/functional'
    },
    shim: {
      angular: {
        exports: 'angular'
      },
      underscore: {
        exports: '_'
      },
      mifosX: {
        deps: ['angular']
      }
    },
  });

  require(['mifosXComponents', 'underscore', 'mifosX'], function(components) {
    var dependencies = [
      'routes',
      'test/test_scenario_loader'
    ];
    dependencies = _.reduce(_.keys(components), function(list, group) {
      return list.concat(_.map(components[group], function(name) { return group + "/" + name; }));
    }, dependencies);

    require(dependencies, function() {
      angular.bootstrap(document, ['MifosX_Application']);
    });
  });
}());
