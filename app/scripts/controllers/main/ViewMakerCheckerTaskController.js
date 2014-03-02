(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewMakerCheckerTaskController: function (scope, routeParams) {
            scope.commandId = routeParams.commandId;
        }
    });
    mifosX.ng.application.controller('ViewMakerCheckerTaskController', ['$scope', '$routeParams', mifosX.controllers.ViewMakerCheckerTaskController]).run(function ($log) {
        $log.info("ViewMakerCheckerTaskController initialized");
    });
}(mifosX.controllers || {}));


