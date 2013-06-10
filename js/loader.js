(function() {
  require.config({
    paths: {
      'angular':      '../lib/angular/angular',
      'angular-mocks': '../lib/angular/angular-mocks',
      'underscore':   '../lib/underscore/underscore',
      'sinon':        '../lib/sinon/sinon-1.7.1',
      'test':         '../test/functional'
    },
    shim: {
      'angular': {
        exports: 'angular'
      },
      'mifosX': {
        deps: ['angular']
      }
    },
  });

  require(['mifosXComponents', 'mifosX', 'underscore'], function(components) {
    var dependencies = ['routes', 'test/test_scenario_loader'];
    dependencies = _.reduce(_.keys(components), function(list, group) {
      return list.concat(_.map(components[group], function(name) { return group + "/" + name; }));
    }, dependencies);

    require(dependencies, function() {
      angular.bootstrap(document, ['MifosX_Application']);
    });
  });
}());
