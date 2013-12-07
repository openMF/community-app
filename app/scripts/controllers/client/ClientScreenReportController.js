(function(module) {
  mifosX.controllers = _.extend(module, {
    ClientScreenReportController: function(scope, resourceFactory, location, http, API_VERSION, routeParams) {
        resourceFactory.templateResource.get({entityId : 0, typeId : 0}, function(data) {
            scope.clientTemplateData = data;
        });
        
        scope.getClientTemplate = function(templateId) {
          scope.selectedTemplate = templateId;
          http({
            method:'POST',
            url: API_VERSION + '/templates/'+templateId+'?clientId='+routeParams.clientId,
            data: {}
          }).then(function(data) {
            scope.template = data.data;
          });
        };
    }
  });
  mifosX.ng.application.controller('ClientScreenReportController', ['$scope', 'ResourceFactory', '$location','$http', 'API_VERSION', '$routeParams', mifosX.controllers.ClientScreenReportController]).run(function($log) {
    $log.info("ClientScreenReportController initialized");
  });
}(mifosX.controllers || {}));
