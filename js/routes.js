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
      .when('/viewclient/:id', {
        templateUrl: 'html/clients/viewclient.html'
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
      .when('/tasks', {
        templateUrl: 'html/tasks.html'
      })
      .when('/viewcurrconfig', {
        templateUrl: 'html/organization/currencyconfig.html'
      })
      .when('/search/:query', {
        templateUrl: 'html/search/glresults.html'
      .when('/viewloanproduct/:id', {
        templateUrl: 'html/products/viewloanproduct.html'
      });

    $locationProvider.html5Mode(false);
  };
  mifosX.ng.application.config(defineRoutes).run(function($log) {
    $log.info("Routes definition completed");
  });
}(mifosX || {}));
