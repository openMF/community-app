(function (module) {
    mifosX.controllers = _.extend(module, {
        AccountingRuleController: function (scope, resourceFactory, location) {
            scope.routeTo = function (id) {
                location.path('/viewaccrule/' + id);
            };
            resourceFactory.accountingRulesResource.get(function (data) {
                scope.rules = data;
            });

        }
    });
    mifosX.ng.application.controller('AccountingRuleController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AccountingRuleController]).run(function ($log) {
        $log.info("AccountingRuleController initialized");
    });
}(mifosX.controllers || {}));