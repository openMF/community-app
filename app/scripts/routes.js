(function(mifosX) {
  var defineRoutes = function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html'
      })
      .when('/login', {
        templateUrl: 'views/login.html'
      })
      .when('/home', {
        templateUrl: 'views/home.html'
      })
      .when('/admin/roles', {
        templateUrl: 'views/administration/roles.html'
      })
      .when('/admin/users', {
        templateUrl: 'views/administration/users.html'
      })
      .when('/clients', {
        templateUrl: 'views/clients/clients.html'  
      })
      .when('/createclient', {
        templateUrl: 'views/clients/createclient.html'  
      })
      .when('/editclient/:id', {
        templateUrl : 'views/clients/editclient.html'
      })
      .when('/viewclient/:id', {
        templateUrl: 'views/clients/viewclient.html'
      })
      .when('/viewloanaccount/:id', {
        templateUrl: 'views/clients/viewclientloanaccountdetails.html'
      })
      .when('/organization', {
        templateUrl: 'views/administration/organization.html'  
      })
      .when('/system', {
        templateUrl: 'views/administration/system.html'  
      })
      .when('/loanproducts', {
        templateUrl: 'views/products/loanproducts.html'
      })
      .when('/charges', {
        templateUrl: 'views/products/charges.html'
      })
      .when('/viewcharge/:id', {
        templateUrl: 'views/products/viewcharge.html'
      })
      .when('/savingproducts', {
        templateUrl: 'views/products/savingproducts.html'
      })
      .when('/viewsavingproduct/:id', {
        templateUrl: 'views/products/viewsavingproduct.html'
      })
      .when('/offices', {
        templateUrl: 'views/organization/offices.html'
      })
      .when('/createoffice', {
        templateUrl: 'views/organization/createoffice.html'
      })
      .when('/viewoffice/:id', {
        templateUrl: 'views/organization/viewoffice.html'
      })
      .when('/tasks', {
        templateUrl: 'views/tasks.html'
      })
      .when('/viewcurrconfig', {
        templateUrl: 'views/organization/currencyconfig.html'
      })
      .when('/search/:query', {
        templateUrl: 'views/search/glresults.html'
      })  
      .when('/viewloanproduct/:id', {
        templateUrl: 'views/products/viewloanproduct.html'
      })
      .when('/usersetting', {
        templateUrl: 'views/administration/usersettings.html'
      })
      .when('/userslist/', {
        templateUrl: 'views/administration/userslist.html'
      })
      .when('/createuser/', {
        templateUrl: 'views/administration/createuser.html'
      })
      .when('/viewuser/:id', {
        templateUrl: 'views/administration/viewuser.html'
      })
      .when('/edituser/:id', {
        templateUrl: 'views/administration/edituser.html'
      })
      .when('/employees', {
        templateUrl: 'views/organization/employees.html'
      })
      .when('/viewemployee/:id', {
        templateUrl: 'views/organization/viewemployee.html'
      })
      .when('/editemployee/:id', {
        templateUrl: 'views/organization/editemployee.html'
      })
      .when('/createemployee/', {
        templateUrl: 'views/organization/createemployee.html'
      })
      .when('/managefunds/', {
        templateUrl: 'views/organization/managefunds.html'
      })
      .when('/nav/offices', {
        templateUrl: 'views/navigation/offices.html'
      })
      .when('/accounting', {
        templateUrl: 'views/accounting/accounting.html'
      })
      .when('/accounting_coa', {
        templateUrl: 'views/accounting/accounting_coa.html'
      })
      .when('/createglaccount', {
        templateUrl: 'views/accounting/createglaccounting.html'
      })
      .when('/viewglaccount/:id', {
        templateUrl: 'views/accounting/viewglaccounting.html'
      })
      .when('/editglaccount/:id', {
        templateUrl: 'views/accounting/editglaccounting.html'
      })
      .when('/freqposting', {
        templateUrl: 'views/accounting/freqposting.html'
      })
      .when('/viewtransactions/:transactionId', {
        templateUrl: 'views/accounting/view_transactions.html'
      })
      .when('/journalentry', {
        templateUrl: 'views/accounting/journalentry_posting.html'
      })
      .when('/searchtransaction', {
        templateUrl: 'views/accounting/search_transaction.html'
      })
      .when('/accounts_closure', {
        templateUrl: 'views/accounting/accounts_closure.html'
      })
      .when('/closedaccountingDetails/:officeId', {
        templateUrl: 'views/accounting/view_close_accounting.html'
      });

    $locationProvider.html5Mode(false);
  };
  mifosX.ng.application.config(defineRoutes).run(function($log) {
    $log.info("Routes definition completed");
  });
}(mifosX || {}));
