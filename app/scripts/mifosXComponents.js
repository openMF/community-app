define(['underscore', 'mifosX'], function() {
  var components = {
    models: [
      'LoggedInUser',
      'roleMap'
    ],
    controllers: [
      'main/MainController',
      'main/LoginFormController',
      'main/TaskController',
      'main/SearchController',
      'loanAccount/ViewClientLoanDetailsController',
      'client/ClientController',
      'client/EditClientController',
      'client/ViewClientController',
      'client/CreateClientController',
      'product/LoanProductController',
      'product/ChargeController',
      'product/ViewChargeController',
      'product/SavingProductController',
      'product/ViewSavingProductController',
      'product/ViewLoanProductController',
      'user/UserController',
      'user/UserFormController',
      'user/UserSettingController',
      'user/UserListController',
      'user/ViewUserController',
      'organization/RoleController',
      'organization/OfficesController',
      'organization/ViewOfficeController',
      'organization/CreateOfficeController',
      'organization/CurrencyConfigController',
      'organization/CreateUserController',
      'organization/EditUserController',
      'organization/ViewEmployeeController',
      'organization/EditEmployeeController',
      'organization/EmployeeController',
      'organization/CreateEmployeeController',
      'organization/ManageFundsController',
      'accounting/AccFreqPostingController',
      'accounting/AccCoaController',
      'accounting/AccCreateGLAccountContoller',
      'accounting/AccViewGLAccountContoller',
      'accounting/AccEditGLAccountController',
      'accounting/ViewTransactionController',
      'accounting/JournalEntryController',
      'accounting/SearchTransactionController',
      'accounting/AccountingClosureController',
      'accounting/AccountingRuleController',
      'accounting/AccCreateRuleController',
      'accounting/AccEditRuleController',
      'accounting/ViewAccRuleController',
      'system/CodeController',
      'system/EditCodeController',
      'system/ViewCodeController',
      'system/AddCodeController',
      'organization/HolController',
      'organization/ViewHolController',
      'organization/AddHolController',
      'reports/ViewReportsController',
      'reports/RunReportsController'
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
