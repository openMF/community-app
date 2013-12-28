(function(module) {
  mifosX.controllers = _.extend(module, {
    ReportsController: function(scope, resourceFactory,location) {
        scope.reports = [];
        scope.routeTo = function(id){
            location.path('/system/viewreport/' + id);
        };
        resourceFactory.reportsResource.getReport(function(data) {
            scope.reports = data;
        });
    }
  });
  mifosX.ng.application.controller('ReportsController', ['$scope', 'ResourceFactory','$location', mifosX.controllers.ReportsController]).run(function($log) {
    $log.info("ReportsController initialized");
  });
}(mifosX.controllers || {}));
