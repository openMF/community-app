(function (module) {
    mifosX.controllers = _.extend(module, {
        LoginFormController: function (scope, authenticationService, resourceFactory, httpService, $timeout) {
            scope.loginCredentials = {};
            scope.passwordDetails = {};
            scope.authenticationFailed = false;
            scope.load = false;

            scope.twoFactorRequired = false;
            scope.twoFactorDeliveryMethods = {};
            scope.selectedDeliveryMethodName = null;
            scope.otpRequestData = {};
            scope.otpToken = null;
            scope.selectedDeliveryMethodName = null;
            scope.twofactorRememberMe = false;

            scope.login = function () {
                scope.authenticationFailed = false;
                scope.load = true;
                authenticationService.authenticateWithUsernamePassword(scope.loginCredentials);
               // delete scope.loginCredentials.password;
            };

            scope.$on("UserAuthenticationFailureEvent", function (event, data, status) {
                delete scope.loginCredentials.password;
                scope.authenticationFailed = true;
                if(status != 401) {
                    scope.authenticationErrorMessage = 'error.connection.failed';
                    scope.load = false;
                } else {
                   scope.authenticationErrorMessage = 'error.login.failed';
                   scope.load = false;
                }
            });

            scope.$on("UserAuthenticationSuccessEvent", function (event, data) {
                scope.load = false;
                scope.authenticationFailed = false;
                scope.twoFactorRequired = false;
                scope.otpRequested = false;
                timer = $timeout(function(){
                    delete scope.loginCredentials.password;
                },2000);

                delete scope.otpToken;
                scope.otpTokenError = false;
                scope.twofactorRememberMe = false;
             });

            scope.$on("UserAuthenticationTwoFactorRequired", function (event, data) {
                scope.load = false;
                scope.twoFactorRequired = true;
                resourceFactory.twoFactorResource.getDeliveryMethods(function (data) {
                    scope.twoFactorDeliveryMethods = data;
                });
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

            // Move to auth service probably
            scope.requestOTP = function () {
                if(scope.selectedDeliveryMethodName != null) {
                    scope.load = true;
                    resourceFactory.twoFactorResource.requestOTP({deliveryMethod: scope.selectedDeliveryMethodName, extendedToken: scope.twofactorRememberMe}, function (data) {
                        scope.load = false;
                        if(data.deliveryMethod !== null) {
                            scope.otpRequestData.deliveryMethod = data.deliveryMethod;
                            scope.otpRequestData.expireDate = new Date(data.reqestTime + data.tokenLiveTimeInSec * 1000);
                            scope.otpRequested = true;
                        }
                    });
                    scope.selectedDeliveryMethodName = null;
                }
            };

            scope.validateOTP = function () {
                if(scope.otpToken !== null) {
                    scope.load = true;
                    authenticationService.validateOTP(scope.otpToken, scope.twofactorRememberMe);
                }
            };

            scope.$on("TwoFactorAuthenticationFailureEvent", function (event, data, status) {
                scope.load = false;
                scope.otpToken = null;
                if(status == 403) {
                    scope.otpErrorMessage = 'error.otp.validate.invalid';
                } else {
                    scope.otpErrorMessage = 'error.otp.validate.other';
                }
                scope.otpTokenError = true;
            });


        }
    });
    mifosX.ng.application.controller('LoginFormController', ['$scope', 'AuthenticationService', 'ResourceFactory', 'HttpService','$timeout', mifosX.controllers.LoginFormController]).run(function ($log) {
        $log.info("LoginFormController initialized");
    });
}(mifosX.controllers || {}));
