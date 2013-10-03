(function(module) {
  mifosX.controllers = _.extend(module, {
    NavigationController: function(scope, resourceFactory) {
        
        scope.offices = [];
        resourceFactory.officeResource.getAllOffices(function(data){
            scope.offices = data;
        });


        scope.select= function(officeId) {
            console.log("test" + officeId);
            scope.selected = officeId; 
        };

     }
  });
  mifosX.ng.application.controller('NavigationController', ['$scope', 'ResourceFactory', mifosX.controllers.NavigationController]).run(function($log) {
    $log.info("NavigationController initialized");
  });
}(mifosX.controllers || {}));
