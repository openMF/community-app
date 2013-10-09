(function(module) {
  mifosX.controllers = _.extend(module, {
    ReportsController: function(scope, resourceFactory) {
        scope.reports = [];
        resourceFactory.reportsResource.getReport(function(data) {
            scope.reports = data;
        });
    }
  });
  mifosX.ng.application.controller('ReportsController', ['$scope', 'ResourceFactory', mifosX.controllers.ReportsController]).run(function($log) {
    $log.info("ReportsController initialized");
  });
}(mifosX.controllers || {}));
