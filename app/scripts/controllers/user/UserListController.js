(function (module) {
    mifosX.controllers = _.extend(module, {
        UserListController: function (scope, resourceFactory, location) {
            scope.users = [];

            scope.routeTo = function (id) {
                location.path('/viewuser/' + id);
            };

            /* -----Throws error on test-----
             if (!scope.searchCriteria.users) {
             scope.searchCriteria.users = null;
             scope.saveSC();
             }
             scope.filterText = scope.searchCriteria.users;

             scope.onFilter = function () {
             scope.searchCriteria.users = scope.filterText;
             scope.saveSC();
             };*/

            scope.UsersPerPage = 15;
            resourceFactory.userListResource.getAllUsers(function (data) {
                scope.users = data;
            });
        }
    });
    mifosX.ng.application.controller('UserListController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.UserListController]).run(function ($log) {
        $log.info("UserListController initialized");
    });
}(mifosX.controllers || {}));