(function (module) {
    mifosX.controllers = _.extend(module, {
        RoleController: function (scope, resourceFactory, location) {
            scope.roles = [];
            scope.routeTo = function (id) {
                location.path('/admin/viewrole/' + id);
            };

            scope.RolesPerPage = 15;
            resourceFactory.roleResource.getAllRoles({}, function (data) {
                scope.roles = data;
            });

            scope.isRoleEnable = function(value) {
                return value;
            };

            if (!scope.searchCriteria.rolesFilterText) {
                scope.searchCriteria.rolesFilterText = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.rolesFilterText || '';

            scope.onFilter = function () {
                scope.searchCriteria.rolesFilterText = scope.filterText;
                scope.saveSC();
            };
        }
    });
    mifosX.ng.application.controller('RoleController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.RoleController]).run(function ($log) {
        $log.info("RoleController initialized");
    });
}(mifosX.controllers || {}));
