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
        templateUrl: 'html/clients.html'  
      })
      .when('/organization', {
        templateUrl: 'html/administration/organization.html'  
      })
      .when('/system', {
        templateUrl: 'html/administration/system.html'  
      })
      .when('/loanproducts', {
        templateUrl: 'html/products/loanproduct.html'
      });

    $locationProvider.html5Mode(false);
  };
  mifosX.ng.application.config(defineRoutes).run(function($log) {
    $log.info("Routes definition completed");
  });
}(mifosX || {}));
