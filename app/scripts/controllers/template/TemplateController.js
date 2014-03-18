(function (module) {
    mifosX.controllers = _.extend(module, {
        TemplateController: function (scope, resourceFactory, location) {
            resourceFactory.templateResource.get(function (data) {
                scope.templates = data;
            });
            scope.routeTo = function (id) {
                location.path('/viewtemplate/' + id);
            };
        }
    });
    mifosX.ng.application.controller('TemplateController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.TemplateController]).run(function ($log) {
        $log.info("TemplateController initialized");
    });
}(mifosX.controllers || {}));
