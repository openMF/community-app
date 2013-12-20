define(['underscore', 'mifosX'], function() {
  var components = {
    models: [
      'models.js'
    ],
    services: [
      'ResourceFactoryProvider.js',
      'HttpServiceProvider.js',
      'AuthenticationService.js',
      'SessionManager.js',
      'Paginator.js'
    ],
    controllers: [
      'controllers.js'
    ],
    filters: [
      'filters.js'
    ],
    directives: [
      'directives.js'
    ]
  };

  require(_.reduce(_.keys(components), function(list, group) {
    return list.concat(_.map(components[group], function(name) { return group + "/" + name; }));
  }, [
    'routes-initialTasks-webstorage-configuration.js'
  ]));
});
