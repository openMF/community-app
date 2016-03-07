(function (module) {
    mifosX.controllers = _.extend(module, {
        AddRoleController: function (scope, routeParams, location, resourceFactory) {
            scope.formData = {};
            resourceFactory.groupResource.get({
                groupId: routeParams.id,
                associations: 'all',
                template: 'true'
            }, function (data) {
                scope.group = data;
                scope.clients = data.clientMembers;
                scope.roles = data.availableRoles;
                console.log("Client members : ", data.clientMembers);
                console.log("Available roles : ", data.availableRoles);

                /**
                 * Checking availableRoles[0] is null before applying it to the main scope.
                 * Otherwise there's a
                 */
                if (data.availableRoles != "") {
                    scope.formData.role = data.availableRoles[0].id;
                }

                /**
                 * In this case, checked undefined because if there are no client members,
                 * server doesn't even send empty client members object. So it's undefined.
                 */
                if (data.clientMembers != undefined) {
                    scope.formData.clientId = data.clientMembers[0].id;
                }
            });

            scope.addrole = function () {
                resourceFactory.groupResource.save({
                    groupId: routeParams.id,
                    command: 'assignRole'
                }, this.formData, function (data) {
                    location.path('/viewgroup/' + data.groupId);
                });
            };

        }
    });
    mifosX.ng.application.controller('AddRoleController', ['$scope', '$routeParams', '$location', 'ResourceFactory', mifosX.controllers.AddRoleController]).run(function ($log) {
        $log.info("AddRoleController initialized");
    });
}(mifosX.controllers || {}));

