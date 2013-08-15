define(['underscore', 'mifosX'], function() {
  var components = {
    models: [
      'LoggedInUser',
      'roleMap'
    ],
    controllers: [
      'MainController',
      'LoginFormController',
      'UserController',
      'UserFormController',
      'RoleController',
      'ClientController',
      'LoanProductController',
      'ChargeController',
      'ViewChargeController',
      'SavingProductController'
    ],
    services: [
      'ResourceFactoryProvider',
      'HttpServiceProvider',
      'AuthenticationService',
      'SessionManager',
      'Paginator'
    ],
    directives: [
      'DataTablesDirective',
      'OverlayDirective',
      'DialogDirective'
    ]
  };

  require(_.reduce(_.keys(components), function(list, group) {
    return list.concat(_.map(components[group], function(name) { return group + "/" + name; }));
  }, [
    'routes',
    'webstorage-configuration'
  ]));
});
