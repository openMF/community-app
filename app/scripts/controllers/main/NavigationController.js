(function (module) {
    mifosX.controllers = _.extend(module, {
        NavigationController: function (scope, resourceFactory, location) {

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.officeId = scope.offices[0].id;
                scope.officeSelected();
            });

            var clearOfficeSelection = function(){
                scope.filterStaff = '';
                scope.staffs = '';
                scope.staff = '';
                clearStaffSelection();
            }

            var clearStaffSelection = function(){
                scope.filterCenter = '';
                scope.centers = '';
                scope.center = '';
                clearCenterSelection();
            }

            var clearCenterSelection = function(){
                scope.filterGroup = '';
                scope.groups = '';
                scope.group = '';
                clearGroupSelection();
            }

            var clearGroupSelection = function(){
                scope.filterClientR = '';
                scope.clients = '';
                scope.client = '';
            }

            scope.officeSelected = function () {
                clearOfficeSelection();
                resourceFactory.employeeResource.getAllEmployees({'officeId': scope.officeId}, function (data) {
                        scope.staffs = data;
                });
            };

            scope.staffSelected = function (staff) {
                clearStaffSelection();
                scope.staff = staff;
                resourceFactory.runReportsResource.get({reportSource: 'GroupNamesByStaff', 'R_staffId': scope.staff.id, genericResultSet: 'false'}, function (data) {
                    scope.centers = data;
                });
            };

            scope.centerSelected = function (center) {
                clearCenterSelection();
                scope.center = center;
                resourceFactory.centerResource.get({centerId: scope.center.id, associations: 'groupMembers'}, function (data) {
                    scope.groups = data.groupMembers;
                });
            };

            scope.groupSelected = function (group) {
                clearGroupSelection();
                scope.group = group;
                resourceFactory.groupResource.get({groupId: scope.group.id, associations: 'activeClientMembers'}, function (data) {
                    scope.clients = data.activeClientMembers;
                });
            };

        }
    });
    mifosX.ng.application.controller('NavigationController', ['$scope', 'ResourceFactory','$location', mifosX.controllers.NavigationController]).run(function ($log) {
        $log.info("NavigationController initialized");
    });
}(mifosX.controllers || {}));
