(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRoleController: function (scope, location, resourceFactory) {
            scope.formData = {};
            scope.submit = function () {
                resourceFactory.roleResource.save(this.formData, function (data) {
                    location.path("/admin/viewrole/" + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRoleController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.CreateRoleController]).run(function ($log) {
        $log.info("CreateRoleController initialized");
    });
}(mifosX.controllers || {}));