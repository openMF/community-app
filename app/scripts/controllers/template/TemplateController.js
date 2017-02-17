(function (module) {
    mifosX.controllers = _.extend(module, {
        TemplateController: function (scope, resourceFactory, location) {
            scope.routeTo = function (id) {
                location.path('/viewtemplate/' + id);
            };

            if (!scope.searchCriteria.templates) {
                scope.searchCriteria.templates = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.templates || '';

            scope.onFilter = function () {
                scope.searchCriteria.templates = scope.filterText;
                scope.saveSC();
            };

            resourceFactory.templateResource.get(function (data) {
                scope.templates = data;
            });
        }
    });
    mifosX.ng.application.controller('TemplateController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.TemplateController]).run(function ($log) {
        $log.info("TemplateController initialized");
    });
}(mifosX.controllers || {}));