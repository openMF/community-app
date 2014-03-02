(function (module) {
    mifosX.controllers = _.extend(module, {
        AddRoleController: function (scope, routeParams, location, resourceFactory) {
            scope.formData = {};
            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'all', template: 'true'}, function (data) {
                scope.group = data;
                scope.clients = data.clientMembers;
                scope.roles = data.availableRoles;
                scope.formData.clientId = data.clientMembers[0].id;
                scope.formData.role = data.availableRoles[0].id;
            });

            scope.addrole = function () {
                resourceFactory.groupResource.save({groupId: routeParams.id, command: 'assignRole'}, this.formData, function (data) {
                    location.path('/viewgroup/' + data.groupId);
                });
            };

        }
    });
    mifosX.ng.application.controller('AddRoleController', ['$scope', '$routeParams', '$location', 'ResourceFactory', mifosX.controllers.AddRoleController]).run(function ($log) {
        $log.info("AddRoleController initialized");
    });
}(mifosX.controllers || {}));

