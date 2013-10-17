(function(module) {
  mifosX.controllers = _.extend(module, {
    TemplateController: function(scope, resourceFactory) {
        resourceFactory.templateResource.get(function(data) {
            scope.templates = data;
        });
    }
  });
  mifosX.ng.application.controller('TemplateController', ['$scope', 'ResourceFactory', mifosX.controllers.TemplateController]).run(function($log) {
    $log.info("TemplateController initialized");
  });
}(mifosX.controllers || {}));
