(function (module) {
    mifosX.controllers = _.extend(module, {
        LoginFormController: function (scope, authenticationService, resourceFactory, httpService) {
            scope.loginCredentials = {};
            scope.passwordDetails = {};
            scope.authenticationFailed = false;

            scope.login = function () {
                authenticationService.authenticateWithUsernamePassword(scope.loginCredentials);
                //clearing username and password fields
                scope.loginCredentials = {};
            };

            $('#pwd').keypress(function (e) {
                if (e.which == 13) {
                    scope.login();
                }
            });

            $('#repeatPassword').keypress(function (e) {
                if (e.which == 13) {
                    scope.login();
                }
            });

            scope.$on("UserAuthenticationFailureEvent", function (data) {
                scope.authenticationFailed = true;
            });

            scope.updatePassword = function (){
                resourceFactory.userListResource.update({'userId': scope.loggedInUserId}, scope.passwordDetails, function (data) {
                    //clear the old authorization token
                    httpService.cancelAuthorization();
                    scope.authenticationFailed = false;
                    scope.loginCredentials.password = scope.passwordDetails.password;
                    authenticationService.authenticateWithUsernamePassword(scope.loginCredentials);
                });
            };
        }
    });
    mifosX.ng.application.controller('LoginFormController', ['$scope', 'AuthenticationService', 'ResourceFactory', 'HttpService', mifosX.controllers.LoginFormController]).run(function ($log) {
        $log.info("LoginFormController initialized");
    });
}(mifosX.controllers || {}));
