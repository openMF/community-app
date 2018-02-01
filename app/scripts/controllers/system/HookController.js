(function (module) {
    mifosX.controllers = _.extend(module, {
        HookController: function (scope, resourceFactory, location) {
            scope.hooks = [];

            scope.routeTo = function (id) {
                location.path('/viewhook/' + id);
            }

            if (!scope.searchCriteria.hooks) {
                scope.searchCriteria.hooks = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.hooks || '';

            scope.onFilter = function () {
                scope.searchCriteria.hooks = scope.filterText;
                scope.saveSC();
            };

            scope.HooksPerPage = 15;
            resourceFactory.hookResources.getAllHooks(function (data) {
                scope.hooks = data;
            });
        }
    });
    mifosX.ng.application.controller('HookController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.HookController]).run(function ($log) {
        $log.info("HookController initialized");
    });
}(mifosX.controllers || {}));