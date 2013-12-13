(function(module) {
  mifosX.controllers = _.extend(module, {
    LoanScreenReportController: function(scope, resourceFactory, location, http, API_VERSION, routeParams,$rootScope) {
        resourceFactory.templateResource.get({entityId : 1, typeId : 0}, function(data) {
            scope.loanTemplateData = data;
        });
        
        scope.getLoanTemplate = function(templateId) {
          scope.selectedTemplate = templateId;
          http({
            method:'POST',
            url: $rootScope.hostUrl +  API_VERSION + '/templates/'+templateId+'?loanId='+routeParams.loanId,
            data: {}
          }).then(function(data) {
            scope.template = data.data;
          });
        };
    }
  });
  mifosX.ng.application.controller('LoanScreenReportController', ['$scope', 'ResourceFactory', '$location','$http', 'API_VERSION', '$routeParams','$rootScope', mifosX.controllers.LoanScreenReportController]).run(function($log) {
    $log.info("LoanScreenReportController initialized");
  });
}(mifosX.controllers || {}));
