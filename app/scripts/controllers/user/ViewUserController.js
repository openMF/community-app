(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewUserController: function (scope, routeParams, route, location, resourceFactory, $modal) {
            scope.user = [];
            scope.formData = {};
            resourceFactory.userListResource.get({userId: routeParams.id}, function (data) {
                scope.user = data;
            });
            scope.open = function () {
                $modal.open({
                    templateUrl: 'password.html',
                    controller: ModalInstanceCtrl
                });
            };
            scope.deleteuser = function () {
                $modal.open({
                    templateUrl: 'deleteuser.html',
                    controller: UserDeleteCtrl
                });
            };
            var ModalInstanceCtrl = function ($scope, $modalInstance) {
                $scope.save = function (staffId) {
                    resourceFactory.userListResource.update({'userId': routeParams.id}, this.formData, function (data) {
                        $modalInstance.close('activate');
                        if (data.resourceId == scope.currentSession.user.userId) {
                            scope.logout();
                        } else{
                            route.reload();
                        };
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            var UserDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.userListResource.delete({userId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/users');
                        // added dummy request param because Content-Type header gets removed
                        // if the request does not contain any data (a request body)
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewUserController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$modal', mifosX.controllers.ViewUserController]).run(function ($log) {
        $log.info("ViewUserController initialized");
    });
}(mifosX.controllers || {}));
