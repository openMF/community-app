(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateOfficeController: function(scope, resourceFactory, location) {
        scope.offices = [];
        resourceFactory.officeResource.getAllOffices(function(data) {
            scope.offices = data;
        });
        
        scope.submit = function() {   
          this.formData.locale = 'en';
          this.formData.dateFormat = 'dd MMMM yyyy';
          this.formData.openingDate = "23 August 2013";
          resourceFactory.officeResource.save(this.formData,function(data){
            location.path('/viewoffice/' + data.resourceId);
          });
        };
    }
  });
  mifosX.ng.application.controller('CreateOfficeController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateOfficeController]).run(function($log) {
    $log.info("CreateOfficeController initialized");
  });
}(mifosX.controllers || {}));
