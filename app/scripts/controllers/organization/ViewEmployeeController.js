(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewEmployeeController: function (scope, routeParams, resourceFactory) {
            scope.employee = [];
            resourceFactory.employeeResource.get({staffId: routeParams.id}, function (data) {
                scope.employee = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewEmployeeController', ['$scope', '$routeParams', 'ResourceFactory', mifosX.controllers.ViewEmployeeController]).run(function ($log) {
        $log.info("ViewEmployeeController initialized");
    });
}(mifosX.controllers || {}));
