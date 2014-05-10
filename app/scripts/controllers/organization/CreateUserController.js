(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateUserController: function (scope, resourceFactory, location) {
            scope.offices = [];
            scope.availableRoles = [];
            scope.formData = {
                sendPasswordToEmail: true
            };
            resourceFactory.userTemplateResource.get(function (data) {
                scope.offices = data.allowedOffices;
                scope.availableRoles = data.availableRoles;
            });

            scope.getOfficeStaff = function(){
                resourceFactory.employeeResource.getAllEmployees({officeId:scope.formData.officeId},function (data) {
                    scope.staffs = data;
                });
            };

            scope.submit = function () {
                resourceFactory.userListResource.save(this.formData, function (data) {
                    location.path('/viewuser/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateUserController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateUserController]).run(function ($log) {
        $log.info("CreateUserController initialized");
    });
}(mifosX.controllers || {}));
