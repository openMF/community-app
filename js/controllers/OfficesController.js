(function(module) {
  mifosX.controllers = _.extend(module, {
    OfficesController: function(scope, resourceFactory) {
        
        scope.offices = [];
        resourceFactory.officeResource.getAllOffices(function(data){
            scope.offices = data;
        });
     }
  });
  mifosX.ng.application.controller('OfficesController', ['$scope', 'ResourceFactory', mifosX.controllers.OfficesController]).run(function($log) {
    $log.info("OfficesController initialized");
  });
}(mifosX.controllers || {}));
