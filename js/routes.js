(function(mifosX) {
  var defineRoutes = function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'html/start.html'
      })
      .when('/login', {
        templateUrl: 'html/login.html'
      })
      .when('/home', {
        templateUrl: 'html/home.html'
      })
      .when('/admin/roles', {
        templateUrl: 'html/administration/roles.html'
      })
      .when('/admin/users', {
        templateUrl: 'html/administration/users.html'
      })
      .when('/clients', {
        templateUrl: 'html/clients/clients.html'  
      })
      .when('/createclient', {
        templateUrl: 'html/clients/createclient.html'  
      })
      .when('/editclient/:id', {
        templateUrl : 'html/clients/editclient.html'
      })
      .when('/viewclient/:id', {
        templateUrl: 'html/clients/viewclient.html'
      })
      .when('/viewloanaccount/:id', {
        templateUrl: 'html/clients/viewclientloanaccountdetails.html'
      })
      .when('/organization', {
        templateUrl: 'html/administration/organization.html'  
      })
      .when('/system', {
        templateUrl: 'html/administration/system.html'  
      })
      .when('/loanproducts', {
        templateUrl: 'html/products/loanproducts.html'
      })
      .when('/charges', {
        templateUrl: 'html/products/charges.html'
      })
      .when('/viewcharge/:id', {
        templateUrl: 'html/products/viewcharge.html'
      })
      .when('/savingproducts', {
        templateUrl: 'html/products/savingproducts.html'
      })
      .when('/offices', {
        templateUrl: 'html/organization/offices.html'
      })
      .when('/createoffice', {
        templateUrl: 'html/organization/createoffice.html'
      })
      .when('/viewoffice/:id', {
        templateUrl: 'html/organization/viewoffice.html'
      })
      .when('/tasks', {
        templateUrl: 'html/tasks.html'
      })
      .when('/viewcurrconfig', {
        templateUrl: 'html/organization/currencyconfig.html'
      })
      .when('/search/:query', {
        templateUrl: 'html/search/glresults.html'
      })  
      .when('/viewloanproduct/:id', {
        templateUrl: 'html/products/viewloanproduct.html'
      })
      .when('/usersetting', {
        templateUrl: 'html/administration/usersettings.html'
      })
      .when('/userslist/', {
        templateUrl: 'html/administration/userslist.html'
      })
      .when('/createuser/', {
        templateUrl: 'html/administration/createuser.html'
      })
      .when('/viewuser/:id', {
        templateUrl: 'html/administration/viewuser.html'
      })
      .when('/edituser/:id', {
        templateUrl: 'html/administration/edituser.html'
      })
      .when('/employees', {
        templateUrl: 'html/organization/employees.html'
      })
      .when('/viewemployee/:id', {
        templateUrl: 'html/organization/viewemployee.html'
      })
      .when('/editemployee/:id', {
        templateUrl: 'html/organization/editemployee.html'
      })
      .when('/createemployee/', {
        templateUrl: 'html/organization/createemployee.html'
      })
      .when('/managefunds/', {
        templateUrl: 'html/organization/managefunds.html'
      })
      .when('/nav/offices', {
        templateUrl: 'html/navigation/offices.html'
      })
      .when('/accounting', {
        templateUrl: 'html/accounting/accounting.html'
      })
      .when('/accounting_coa', {
        templateUrl: 'html/accounting/accounting_coa.html'
      })
      .when('/createglaccount', {
        templateUrl: 'html/accounting/createglaccounting.html'
      })
      .when('/viewglaccount/:id', {
        templateUrl: 'html/accounting/viewglaccounting.html'
      })
      .when('/editglaccount/:id', {
        templateUrl: 'html/accounting/editglaccounting.html'
      })
      .when('/freqposting', {
        templateUrl: 'html/accounting/freqposting.html'
      })
      .when('/viewtransactions/:transactionId', {
        templateUrl: 'html/accounting/view_transactions.html'
      })
      .when('/journalentry', {
        templateUrl: 'html/accounting/journalentry_posting.html'
      })
      .when('/searchtransaction', {
        templateUrl: 'html/accounting/search_transaction.html'
      });

    $locationProvider.html5Mode(false);
  };
  mifosX.ng.application.config(defineRoutes).run(function($log) {
    $log.info("Routes definition completed");
  });
}(mifosX || {}));
