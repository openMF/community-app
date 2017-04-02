(function (module) {
    mifosX.controllers = _.extend(module, {
        ProfileController: function (scope,httpService,localStorageService, resourceFactory, $modal) {
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


           // scope.authenticationFailed = false;

            var autho=false;

            var UpdatePasswordCtrl = function ($scope,$modalInstance, userId) {

                $scope.save = function (currentpassword1) {

                    var apiVer = '/mifosng-provider/api/v1';

                    httpService.post(apiVer + "/authentication?username=" + $scope.userDetails.username + "&password=" + currentpassword1)
                        .then(function (response, $scope, data, $modalInstance, userId) {
                            //set autho to true if password matches
                            autho=true;
                        }, function errorCallback(response) {
                            //throw error when password does not match
                            $scope.PostDataResponse = "incorrect password";
                            autho=false;
                        });

                    //update password if password matches
                    if(autho)
                    {
                    resourceFactory.userListResource.update({'userId': userId}, this.formData, function (data) {
                        $modalInstance.close('modal');
                        if (data.resourceId == userId) {
                            scope.logout();
                        }
                    })
                }

                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };


        }
    });
    mifosX.ng.application.controller('ProfileController', ['$rootScope','HttpService','localStorageService', 'ResourceFactory', '$modal', mifosX.controllers.ProfileController]).run(function ($log) {
        $log.info("ProfileController initialized");
    });
}(mifosX.controllers || {}));
