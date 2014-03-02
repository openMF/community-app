(function (module) {
    mifosX.controllers = _.extend(module, {
        CodeController: function (scope, resourceFactory, location) {
            scope.codes = [];
            resourceFactory.codeResources.getAllCodes(function (data) {
                scope.codes = data;
            });
            scope.routeTo = function (id) {
                location.path('/viewcode/' + id);
            }
        }
    });
    mifosX.ng.application.controller('CodeController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CodeController]).run(function ($log) {
        $log.info("CodeController initialized");
    });
}(mifosX.controllers || {}));
