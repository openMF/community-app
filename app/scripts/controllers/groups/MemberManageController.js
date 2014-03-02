(function (module) {
    mifosX.controllers = _.extend(module, {
        MemberManageController: function (scope, routeParams, route, location, resourceFactory) {
            scope.group = [];
            scope.managecode = routeParams.managecode;

            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'all'}, function (data) {
                scope.group = data;
            });

            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'clientMembers', template: 'true'}, function (data) {
                scope.allClients = data.clientOptions;
                scope.allMembers = data.clientMembers;
            });

            scope.associate = function () {
                resourceFactory.groupResource.save({groupId: routeParams.id, command: 'associateClients'}, this.formData, function (data) {
                    location.path('/viewgroup/' + data.groupId);
                });
            };

            scope.disassociate = function () {
                var disassociateMembers = new Object();
                disassociateMembers.clientMembers = this.formData.clientMembers;
                resourceFactory.groupResource.save({groupId: routeParams.id, command: 'disassociateClients'}, disassociateMembers, function (data) {
                    location.path('/viewgroup/' + data.groupId);
                });
            };
        }
    });
    mifosX.ng.application.controller('MemberManageController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.MemberManageController]).run(function ($log) {
        $log.info("MemberManageController initialized");
    });
}(mifosX.controllers || {}));
