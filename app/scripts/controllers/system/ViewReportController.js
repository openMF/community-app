(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewReportController: function(scope, routeParams , resourceFactory ) {
        scope.employee = [];
        resourceFactory.reportsResource.getReportDetails({id: routeParams.id} , function(data) {
            scope.report = data;
        });
    }
  });
  mifosX.ng.application.controller('ViewReportController', ['$scope', '$routeParams','ResourceFactory', mifosX.controllers.ViewReportController]).run(function($log) {
    $log.info("ViewReportController initialized");
  });
}(mifosX.controllers || {}));
