(function (module) {
    mifosX.controllers = _.extend(module, {
        LoginFormController: function (scope, authenticationService, resourceFactory, httpService, $timeout) {
            scope.loginCredentials = {};
            scope.passwordDetails = {};
            scope.authenticationFailed = false;

            scope.login = function () {
                authenticationService.authenticateWithUsernamePassword(scope.loginCredentials);
               // delete scope.loginCredentials.password;
            };

            scope.$on("UserAuthenticationFailureEvent", function (event, data) {
                delete scope.loginCredentials.password;
                scope.authenticationFailed = true;
            });

            scope.$on("UserAuthenticationSuccessEvent", function (event, data) {
                timer = $timeout(function(){
                    delete scope.loginCredentials.password;
                },2000)
             });

            /*This logic is no longer required as enter button is binded with text field for submit.
            $('#pwd').keypress(function (e) {
                if (e.which == 13) {
                    scope.login();
                }
            });*/

            /*$('#repeatPassword').keypress(function (e) {
                if (e.which == 13) {
                    scope.updatePassword();
                }
            });*/

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
    mifosX.ng.application.controller('LoginFormController', ['$scope', 'AuthenticationService', 'ResourceFactory', 'HttpService','$timeout', mifosX.controllers.LoginFormController]).run(function ($log) {
        $log.info("LoginFormController initialized");
    });
}(mifosX.controllers || {}));
