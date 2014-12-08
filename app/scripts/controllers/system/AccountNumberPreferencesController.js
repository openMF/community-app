(function (module) {
    mifosX.controllers = _.extend(module, {
        AccountNumberPreferencesController: function (scope, resourceFactory, location) {
            resourceFactory.accountNumberResources.getAllPreferences(function(data){
                scope.preferences = data;
            });
            scope.routeTo = function (id) {
                location.path('/viewaccountnumberpreferences/' + id);
            }
        }
    });
    mifosX.ng.application.controller('AccountNumberPreferencesController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AccountNumberPreferencesController]).run(function ($log) {
        $log.info("AccountNumberPreferencesController initialized");
    });
}(mifosX.controllers || {}));
