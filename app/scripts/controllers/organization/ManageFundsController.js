(function(module) {
    mifosX.controllers = _.extend(module, {
    ManageFundsController: function(scope, location, resourceFactory) {
        
        scope.funderror = false;
        resourceFactory.fundsResource.getAllFunds(function(data){
            scope.funds = data;
        });

        scope.addFund = function (){
  
            if(scope.newfund != undefined ) {
              scope.funderror = false;
              resourceFactory.fundsResource.save({'name':scope.newfund} , function(data){
                  location.path('/managefunds');
              });
            } else {
              scope.funderror = true;
            }
    
            scope.newfund = undefined;
        };

     }
  });
  mifosX.ng.application.controller('ManageFundsController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.ManageFundsController]).run(function($log) {
    $log.info("ManageFundsController initialized");
  });
}(mifosX.controllers || {}));
