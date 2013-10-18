(function(module) {
  mifosX.controllers = _.extend(module, {
    EntityTemplateController: function(scope, http, location, routeParams) {
      http({
        method:'POST',
        url: 'https://demo.openmf.org/mifosng-provider/api/v1/templates/'+routeParams.templateId+'?'+routeParams.entityaction+'='+routeParams.entityId,
        data: {}
      }).then(function(data) {
        scope.template = data.data;
      });
    }
  });
  mifosX.ng.application.controller('EntityTemplateController', ['$scope', '$http', '$location', '$routeParams', mifosX.controllers.EntityTemplateController]).run(function($log) {
    $log.info("EntityTemplateController initialized");
  });
}(mifosX.controllers || {}));
