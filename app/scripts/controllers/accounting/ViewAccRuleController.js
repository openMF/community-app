(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewAccRuleController: function(scope, resourceFactory, routeParams, location) {

    resourceFactory.accountingRulesResource.getById({accountingRuleId:routeParams.id}, function(data){
      scope.rule = data;
    });

    scope.deleteRule = function (){
        resourceFactory.accountingRulesResource.delete({accountingRuleId:routeParams.id}, {}, function(data){
        location.path('/accounting_rules');
      });
    };


    }
  });
  mifosX.ng.application.controller('ViewAccRuleController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.ViewAccRuleController]).run(function($log) {
    $log.info("ViewAccRuleController initialized");
  });
}(mifosX.controllers || {}));