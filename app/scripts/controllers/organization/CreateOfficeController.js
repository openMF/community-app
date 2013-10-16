(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateOfficeController: function(scope, resourceFactory, location,dateFilter) {
        scope.offices = [];
        scope.first = {};
        scope.first.date = new Date();
        resourceFactory.officeResource.getAllOffices(function(data) {
            scope.offices = data;
            scope.formData = {
              parentId : scope.offices[0].id
            }
        });
        
        scope.submit = function() {   
          this.formData.locale = 'en';
          var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
          this.formData.dateFormat = 'dd MMMM yyyy';
          this.formData.openingDate = reqDate;
          resourceFactory.officeResource.save(this.formData,function(data){
            location.path('/viewoffice/' + data.resourceId);
          });
        };
    }
  });
  mifosX.ng.application.controller('CreateOfficeController', ['$scope', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.CreateOfficeController]).run(function($log) {
    $log.info("CreateOfficeController initialized");
  });
}(mifosX.controllers || {}));
