(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewTemplateController: function(scope, routeParams , resourceFactory ) {
        resourceFactory.templateResource.getTemplateDetails({templateId: routeParams.id} , function(data) {
            scope.template = data;
        });
    }
  });
  mifosX.ng.application.controller('ViewTemplateController', ['$scope', '$routeParams','ResourceFactory', mifosX.controllers.ViewTemplateController]).run(function($log) {
    $log.info("ViewTemplateController initialized");
  });
}(mifosX.controllers || {}));
