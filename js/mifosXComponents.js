define(['underscore', 'mifosX'], function() {
  var components = {
    models: [
      'User',
      'roleMap'
    ],
    controllers: [
      'MainController',
      'LoginFormController',
      'UserController'
    ],
    services: [
      'ResourceFactoryProvider',
      'HttpServiceProvider',
      'AuthenticationService',
      'SessionManager'
    ],
    directives: [
      'DataTablesDirective'
    ]
  };

  require(_.reduce(_.keys(components), function(list, group) {
    return list.concat(_.map(components[group], function(name) { return group + "/" + name; }));
  }, [
    'routes',
    'webstorage-configuration'
  ]));
});
