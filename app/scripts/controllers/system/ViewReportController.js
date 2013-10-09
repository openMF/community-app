(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewReportController: function(scope, routeParams , resourceFactory,location) {
      resourceFactory.reportsResource.getReportDetails({id: routeParams.id} , function(data) {
          scope.report = data;
          scope.noncoreReport = data.coreReport==true ? false : true;
      });

      scope.deletereport = function (){
        resourceFactory.reportsResource.delete({id: routeParams.id} , {} , function(data) {
              location.path('/reports');
        });
      };
    }
  });
  mifosX.ng.application.controller('ViewReportController', ['$scope', '$routeParams','ResourceFactory', '$location', mifosX.controllers.ViewReportController]).run(function($log) {
    $log.info("ViewReportController initialized");
  });
}(mifosX.controllers || {}));
