define(['underscore', 'mifosX'], function() {
  var components = {
    models: [
      'LoggedInUser',
      'roleMap'
    ],
    services: [
      'ResourceFactoryProvider',
      'HttpServiceProvider',
      'AuthenticationService',
      'SessionManager',
      'Paginator'
    ],
    controllers: [
      'main/MainController',
      'main/LoginFormController',
      'main/TaskController',
      'main/SearchController',
      'loanAccount/ViewClientLoanDetailsController',
      'loanAccount/ClientNewLoanAccAppController',
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
      'system/ViewDataTableController',
      'system/DataTableController',
      'organization/HolController',
      'organization/ViewHolController',
      'organization/AddHolController',
      'reports/ViewReportsController',
      'reports/RunReportsController',
      'savings/CreateSavingAccountController',
      'savings/ViewSavingDetailsController',
      'private/SuperuserController',
      'groups/GroupController',
      'groups/ViewGroupController',
      'savings/EditSavingAccountController',
      'savings/SavingAccountActionsController',
      'accounttransfers/ViewAccountTransferDetailsController',
      'accounttransfers/MakeAccountTransferController',
      'savings/ViewTransactionController',
      'groups/CreateGroupController',
      'groups/AddMemberController',
      'groups/EditGroupController',
      'groups/ManageGroupController'
    ],
    filters: [
      'StatusLookup'
    ],
    directives: [
      'DataTablesDirective',
      'OverlayDirective',
      'DialogDirective',
      'PanelDirective'
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
