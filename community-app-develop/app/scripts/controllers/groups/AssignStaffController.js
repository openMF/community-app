(function (module) {
    mifosX.controllers = _.extend(module, {
        AssignStaffController: function (scope, resourceFactory, location, routeParams) {
            scope.group = [];
            scope.staff = [];
            scope.formData = {};
            resourceFactory.assignStaffResource.get({groupOrCenter: routeParams.entityType, groupOrCenterId: routeParams.id, template: 'true',staffInSelectedOfficeOnly:true}, function (data) {
                scope.group = data;
                scope.staffs = data.staffOptions;
                scope.formData.staffId = data.staffOptions[0].id;
            });
            scope.assignStaff = function () {

                if (routeParams.entityType == "groups") {
                    scope.r = "viewgroup/";
                }
                else if (routeParams.entityType == "centers") {
                    scope.r = "viewcenter/";
                }
                resourceFactory.assignStaffResource.save({groupOrCenterId: routeParams.id, command: 'assignStaff'}, this.formData, function (data) {
                    location.path(scope.r + data.groupId);
                });
            };
        }
    });
    mifosX.ng.application.controller('AssignStaffController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.AssignStaffController]).run(function ($log) {
        $log.info("AssignStaffController initialized");
    });
}(mifosX.controllers || {}));