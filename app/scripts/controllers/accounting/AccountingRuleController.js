(function (module) {
    mifosX.controllers = _.extend(module, {
        AccountingRuleController: function (scope, resourceFactory, location, anchorScroll) {
            scope.routeTo = function (id) {
                location.path('/viewaccrule/' + id);
            };
            scope.scrollto = function (link){
                location.hash(link);
                anchorScroll();

            };

            resourceFactory.accountingRulesResource.get(function (data) {
                scope.rules = data;
            });
         

        }
    });
    mifosX.ng.application.controller('AccountingRuleController', ['$scope', 'ResourceFactory', '$location','$anchorScroll', mifosX.controllers.AccountingRuleController]).run(function ($log) {
        $log.info("AccountingRuleController initialized");
    });
}(mifosX.controllers || {}));