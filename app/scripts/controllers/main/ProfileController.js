(function (module) {
    mifosX.controllers = _.extend(module, {
        ProfileController: function (scope, localStorageService, resourceFactory, $modal) {
            scope.userDetails = localStorageService.getFromLocalStorage('userData');
            resourceFactory.userListResource.get({userId: scope.userDetails.userId}, function (data) {
                scope.user = data;
            });
            scope.status = 'Not Authenticated';
            if (scope.userDetails.authenticated == true) {
                scope.status = 'Authenticated';
            }
            scope.updatePassword = function () {
                $modal.open({
                    templateUrl: 'password.html',
                    controller: UpdatePasswordCtrl,
                    resolve: {
                        userId: function () {
                            return scope.userDetails.userId;
                        }
                    }
                });
            };
            var UpdatePasswordCtrl = function ($scope, $modalInstance, userId) {
                $scope.save = function () {
                    resourceFactory.userListResource.update({'userId': userId}, this.formData, function (data) {
                        $modalInstance.close('modal');
                        if (data.resourceId == userId) {
                            scope.logout();
                        };
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ProfileController', ['$scope', 'localStorageService', 'ResourceFactory', '$modal', mifosX.controllers.ProfileController]).run(function ($log) {
        $log.info("ProfileController initialized");
    });
}(mifosX.controllers || {}));
