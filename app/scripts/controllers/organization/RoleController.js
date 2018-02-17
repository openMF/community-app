(function (module) {
    mifosX.controllers = _.extend(module, {
        RoleController: function (scope, resourceFactory, location) {
            scope.roles = [];
            scope.routeTo = function (id) {
                location.path('/admin/viewrole/' + id);
            };
            
            if (!scope.searchCriteria.roles) {
                scope.searchCriteria.roles = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.roles || '';

            scope.onFilter = function () {
                scope.searchCriteria.roles = scope.filterText;
                scope.saveSC();
            };
            
            resourceFactory.roleResource.getAllRoles({}, function (data) {
                scope.roles = data;
            });

            scope.isRoleEnable = function(value) {
                return value;
            };
        }
    });
    mifosX.ng.application.controller('RoleController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.RoleController]).run(function ($log) {
        $log.info("RoleController initialized");
    });
}(mifosX.controllers || {}));
