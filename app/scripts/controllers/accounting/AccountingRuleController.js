(function(module) {
  mifosX.controllers = _.extend(module, {
    AccountingRuleController: function(scope, resourceFactory) {

		resourceFactory.accountingRulesResource.get(function(data){
			scope.rules = data;
		});

    }
  });
  mifosX.ng.application.controller('AccountingRuleController', ['$scope', 'ResourceFactory', mifosX.controllers.AccountingRuleController]).run(function($log) {
    $log.info("AccountingRuleController initialized");
  });
}(mifosX.controllers || {}));