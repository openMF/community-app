(function (module) {
    mifosX.controllers = _.extend(module, {
        AccountNumberPreferencesController: function (scope, resourceFactory, location) {
            scope.routeTo = function (id) {
                location.path('/viewaccountnumberpreferences/' + id);
            }

            if (!scope.searchCriteria.anp) {
                scope.searchCriteria.anp = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.anp || '';

            scope.onFilter = function () {
                scope.searchCriteria.anp = scope.filterText;
                scope.saveSC();
            }

            resourceFactory.accountNumberResources.getAllPreferences(function (data) {
                scope.preferences = data;
            });
        }
    });
    mifosX.ng.application.controller('AccountNumberPreferencesController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AccountNumberPreferencesController]).run(function ($log) {
        $log.info("AccountNumberPreferencesController initialized");
    });
}(mifosX.controllers || {}));