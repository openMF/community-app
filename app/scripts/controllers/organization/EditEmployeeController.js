(function (module) {
    mifosX.controllers = _.extend(module, {
        EditEmployeeController: function (scope, routeParams, resourceFactory, location) {
            scope.offices = [];

            resourceFactory.employeeResource.get({staffId: routeParams.id, template: 'true'}, function (data) {
                scope.offices = data.allowedOffices;
                scope.staffId = data.id;
                scope.formData = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    isLoanOfficer: data.isLoanOfficer,
                    officeId: data.officeId,
                    mobileNo: data.mobileNo,
                    isActive: data.isActive
                };

            });

            scope.submit = function () {
                resourceFactory.employeeResource.update({'staffId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewemployee/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditEmployeeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditEmployeeController]).run(function ($log) {
        $log.info("EditEmployeeController initialized");
    });
}(mifosX.controllers || {}));
