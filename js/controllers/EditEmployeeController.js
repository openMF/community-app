(function(module) {
  mifosX.controllers = _.extend(module, {
    EditEmployeeController: function(scope, routeParams, resourceFactory, location) {
        scope.offices = [];

        resourceFactory.employeeResource.get({staffId: routeParams.id, template: 'true'} , function(data) {
            scope.offices = data.allowedOffices;
            scope.formData = {
              firstname : data.firstname,
              lastname : data.lastname,
              isLoanOfficer: data.isLoanOfficer
            };

            for(var i=0; i< data.allowedOffices.length; i++){
                  if(data.allowedOffices[i].id == data.officeId){
                    scope.formData.officeName = data.allowedOffices[i];
                    break;
                  }
              }

        });
        
        scope.submit = function() {
          
             this.formData.officeId = this.formData.officeName.id;
             delete this.formData.officeName;

             resourceFactory.employeeResource.update({'staffId': routeParams.id},this.formData,function(data){
             location.path('/viewemployee/' + data.resourceId);
          });
        };
    }
  });
  mifosX.ng.application.controller('EditEmployeeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditEmployeeController]).run(function($log) {
    $log.info("EditEmployeeController initialized");
  });
}(mifosX.controllers || {}));
