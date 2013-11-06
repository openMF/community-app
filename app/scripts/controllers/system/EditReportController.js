(function(module) {
  mifosX.controllers = _.extend(module, {
    EditReportController: function(scope, resourceFactory, location, routeParams) {
        scope.formData =  {};
        scope.reportParameters = [];

        resourceFactory.reportsResource.getReportDetails({id : routeParams.id, template : 'true'}, function(data) {
            scope.reportdetail = data;
            scope.formData.useReport = data.useReport;
        });
        scope.submit = function() {
          this.formData.reportParameters = scope.temp;
          resourceFactory.reportsResource.update({id: routeParams.id}, this.formData,function(data){
            location.path('/system/viewreport/' + data.resourceId);
          });
        };
    }
  });
  mifosX.ng.application.controller('EditReportController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.EditReportController]).run(function($log) {
    $log.info("EditReportController initialized");
  });
}(mifosX.controllers || {}));
