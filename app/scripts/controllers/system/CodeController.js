(function (module) {
    mifosX.controllers = _.extend(module, {
        CodeController: function (scope, resourceFactory, location) {
            scope.codes = [];

            scope.routeTo = function (id) {
                location.path('/viewcode/' + id);
            }

            if (!scope.searchCriteria.codes) {
                scope.searchCriteria.codes = '';
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.codes;

            scope.onFilter = function () {
                scope.searchCriteria.codes = scope.filterText;
                scope.saveSC();
            };

            resourceFactory.codeResources.getAllCodes(function (data) {
                scope.codes = data;
            });
        }
    });
    mifosX.ng.application.controller('CodeController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CodeController]).run(function ($log) {
        $log.info("CodeController initialized");
    });
}(mifosX.controllers || {}));