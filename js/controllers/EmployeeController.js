(function(module) {
  mifosX.controllers = _.extend(module, {
    EmployeeController: function(scope, resourceFactory) {
        scope.employees = [];
        resourceFactory.employeeResource.getAllEmployees(function(data) {
            scope.employees = data;
        });
    }
  });
  mifosX.ng.application.controller('EmployeeController', ['$scope', 'ResourceFactory', mifosX.controllers.EmployeeController]).run(function($log) {
    $log.info("EmployeeController initialized");
  });
}(mifosX.controllers || {}));
