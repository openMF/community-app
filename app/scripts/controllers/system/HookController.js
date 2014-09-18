(function (module) {
    mifosX.controllers = _.extend(module, {
        HookController: function (scope, resourceFactory, location) {
            scope.hooks = [];
            resourceFactory.hookResources.getAllHooks(function (data) {
                scope.hooks = data;
            });
            scope.routeTo = function (id) {
                location.path('/viewhook/' + id);
            }
        }
    });
    mifosX.ng.application.controller('HookController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.HookController]).run(function ($log) {
        $log.info("HookController initialized");
    });
}(mifosX.controllers || {}));
