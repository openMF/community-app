(function(module) {
  mifosX.controllers = _.extend(module, {
    AccFreqPostingController: function(scope, resourceFactory, location) {

            resourceFactory.accountingRulesResource.getAllRules({associations : 'all'}, function(data){
              scope.rules = data;
            });


            resourceFactory.officeResource.getAllOffices(function(data){
              scope.offices = data;  
            });
    }
  });
  mifosX.ng.application.controller('AccFreqPostingController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AccFreqPostingController]).run(function($log) {
    $log.info("AccFreqPostingController initialized");
  });
}(mifosX.controllers || {}));
