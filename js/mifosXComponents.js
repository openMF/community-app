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
      'UserSettingController',
      'RoleController',
      'ClientController',
      'ViewClientLoanDetailsController',
      'EditClientController',
      'LoanProductController',
      'ChargeController',
      'ViewChargeController',
      'SavingProductController',
      'ViewSavingProductController',
      'OfficesController',
      'ViewOfficeController',
      'CreateOfficeController',
      'ViewClientController',
      'CreateClientController',
      'TaskController',
      'DataTableController',
      'ViewDataTableController',
      'CurrencyConfigController',
      'SearchController',
      'ViewLoanProductController',
      'UserListController',
      'CreateUserController',
      'ViewUserController',
      'EditUserController',
      'EmployeeController',
      'ViewEmployeeController',
      'EditEmployeeController',
      'CreateEmployeeController',
      'ManageFundsController',
      'AccFreqPostingController',
      'AccCoaController',
      'AccCreateGLAccountContoller',
      'AccViewGLAccountContoller',
      'AccEditGLAccountController',
      'ViewTransactionController',
      'JournalEntryController',
      'SearchTransactionController',
      'AccountingClosureController',
      'AccountingRuleController',
      'ViewAccRuleController',
      'AccCreateRuleController',
      'AccEditRuleController',
      'CodeController',
      'AddCodeController',
      'ViewCodeController',
      'EditCodeController',
      'HolController',
      'ViewHolController',
      'AddHolController',
      'ViewReportsController',
      'RunReportsController'
    ],
    filters: [
      'StatusLookup'
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
    'initialTasks',
    'webstorage-configuration'
  ]));
});
