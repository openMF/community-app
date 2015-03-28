(function (module) {
    mifosX.controllers = _.extend(module, {
        EditUserController: function (scope, routeParams, resourceFactory, location) {

            scope.formData = {};
            scope.offices = [];
            scope.availableRoles = [];
            scope.user = [];
            scope.selectedRoles = [];

            resourceFactory.userListResource.get({userId: routeParams.id, template: 'true'}, function (data) {
                scope.formData.username = data.username;
                scope.formData.firstname = data.firstname;
                scope.formData.lastname = data.lastname;
                scope.formData.email = data.email;
                scope.formData.officeId = data.officeId;
                scope.getOfficeStaff();
                if(data.staff){
                    scope.formData.staffId = data.staff.id;
                }
                scope.formData.selectedRoles=data.selectedRoles;
                scope.userId = data.id;
                scope.offices = data.allowedOffices;
                scope.availableRoles = data.availableRoles.concat(data.selectedRoles);
                scope.formData.passwordNeverExpires = data.passwordNeverExpires;
            });
            scope.getOfficeStaff = function(){
                resourceFactory.employeeResource.getAllEmployees({officeId:scope.formData.officeId},function (staffs) {
                    scope.staffs = staffs;
                });
            };
            scope.submit = function () {
                var roles = [];
                for (var i = 0; i < scope.formData.selectedRoles.length; i++) {
                    roles.push(scope.formData.selectedRoles[i].id);
                }

                this.formData.roles = roles;
                delete this.formData.selectedRoles;

                resourceFactory.userListResource.update({'userId': scope.userId}, this.formData, function (data) {
                    location.path('/viewuser/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditUserController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditUserController]).run(function ($log) {
        $log.info("EditUserController initialized");
    });
}(mifosX.controllers || {}));
