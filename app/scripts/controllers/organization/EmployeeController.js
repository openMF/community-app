(function (module) {
    mifosX.controllers = _.extend(module, {
        EmployeeController: function (scope, resourceFactory, location) {
            scope.employees = [];
            scope.routeTo = function (id) {
                location.path('/viewemployee/' + id);
            };

            if (!scope.searchCriteria.employees) {
                scope.searchCriteria.employees = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.employees || '';

            scope.onFilter = function () {
                scope.searchCriteria.employees = scope.filterText;
                scope.saveSC();
            };

            scope.EmployeesPerPage = 15;
            resourceFactory.employeeResource.getAllEmployees(function (data) {
                scope.employees = data;
            });
        }
    });
    mifosX.ng.application.controller('EmployeeController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.EmployeeController]).run(function ($log) {
        $log.info("EmployeeController initialized");
    });
}(mifosX.controllers || {}));