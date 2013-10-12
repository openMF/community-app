(function(module) {
  mifosX.controllers = _.extend(module, {
    NavigationController: function(scope, resourceFactory) {
        
        scope.offices = [];
        resourceFactory.officeResource.getAllOffices(function(data){
          scope.offices = data;
        });


        scope.officeSelected= function(officeId) {
            scope.selectedOffice = officeId;
            scope.staffs = '';
            scope.groupsOrCenters = '';
          resourceFactory.employeeResource.getAllEmployees({'officeId' : officeId}, function(data){
            scope.staffs = data;
          });
        };

        scope.staffSelected= function(staffId) {
          scope.selectedStaff = staffId;
          resourceFactory.runReportsResource.get({reportSource : 'GroupNamesByStaff', 'R_staffId' : staffId, genericResultSet : 'false'}, function(data){
            scope.groupsOrCenters = data;
          });
        };

     }
  });
  mifosX.ng.application.controller('NavigationController', ['$scope', 'ResourceFactory', mifosX.controllers.NavigationController]).run(function($log) {
    $log.info("NavigationController initialized");
  });
}(mifosX.controllers || {}));
