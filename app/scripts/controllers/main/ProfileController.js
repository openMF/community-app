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
                        },
                        usrnme : function () {
                            return scope.userDetails.username;
                        }
                    }
                });
            };
            var UpdatePasswordCtrl = function ($scope, $modalInstance, userId,usrnme) {
                $scope.save = function (currentPass) {
                   // var username=scope.userDetails.username;
                    $scope.PostDataResponse=currentPass;

                    resourceFactory.userListResource.update({'userId': userId,'usrnme': usrnme,'currentPass':currentPass}, this.formData, function (data) {

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
