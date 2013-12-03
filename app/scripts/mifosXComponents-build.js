define(['underscore', 'mifosX'], function() {
  var components = {
    models: [
      'models'
    ],
    services: [
      'ResourceFactoryProvider',
      'HttpServiceProvider',
      'AuthenticationService',
      'SessionManager',
      'Paginator'
    ],
    controllers: [
      'controllers'
    ],
    filters: [
      'filters'
    ],
    directives: [
      'directives'
    ]
  };

  require(_.reduce(_.keys(components), function(list, group) {
    return list.concat(_.map(components[group], function(name) { return group + "/" + name; }));
  }, [
    'routes-initialTasks-webstorage-configuration'
  ]));
});
