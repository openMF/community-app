(function(module) {
    mifosX.controllers = _.extend(module, {
    ManageFundsController: function(scope, location, resourceFactory) {
        
        resourceFactory.fundsResource.getAllFunds(function(data){
            scope.funds = data;
        });

        scope.addFund = function (){
  
            if(scope.newfund != undefined ) {
                  resourceFactory.fundsResource.save({'name':scope.newfund} , function(data){
                      location.path('/managefunds');
                  });
            }
    
            scope.newfund = undefined;
        };

     }
  });
  mifosX.ng.application.controller('ManageFundsController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.ManageFundsController]).run(function($log) {
    $log.info("ManageFundsController initialized");
  });
}(mifosX.controllers || {}));
