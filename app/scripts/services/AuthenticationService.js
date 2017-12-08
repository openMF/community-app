(function (module) {
    mifosX.services = _.extend(module, {
        AuthenticationService: function (scope, httpService, SECURITY, localStorageService,timeout, webStorage) {
            var userData = null;
            var twoFactorIsRememberMeRequest = false;
            var twoFactorAccessToken = null;

            var onLoginSuccess = function (data) {
                if(data.isTwoFactorAuthenticationRequired != null && data.isTwoFactorAuthenticationRequired == true) {
                    if(hasValidTwoFactorToken(data.username)) {
                        var token = getTokenFromStorage(data.username);
                        onTwoFactorRememberMe(data, token);
                    } else {
                        userData = data;
                        scope.$broadcast("UserAuthenticationTwoFactorRequired", data);
                    }
                } else {
                    scope.$broadcast("UserAuthenticationSuccessEvent", data);
                    localStorageService.addToLocalStorage('userData', data);
                }
            };

            var onLoginFailure = function (data, status) {
                scope.$broadcast("UserAuthenticationFailureEvent", data, status);
            };

            var apiVer = '/fineract-provider/api/v1';

            var getUserDetails = function(data){

                localStorageService.addToLocalStorage('tokendetails', data);
                setTimer(data.expires_in);
                httpService.get( apiVer + "/userdetails?access_token=" + data.access_token)
                    .success(onLoginSuccess)
                    .error(onLoginFailure);

            }

            var updateAccessDetails = function(data){
                var sessionData = webStorage.get('sessionData');
                sessionData.authenticationKey = data.access_token;
                webStorage.add("sessionData",sessionData);
                localStorageService.addToLocalStorage('tokendetails', data);
                var userDate = localStorageService.getFromLocalStorage("userData");
                userDate.accessToken =  data.access_token;
                localStorageService.addToLocalStorage('userData', userDate);
                httpService.setAuthorization(data.access_token);
                setTimer(data.expires_in);
            }

            var setTimer = function(time){
                timeout(getAccessToken, time * 1000);
            }

            var getAccessToken = function(){
                var refreshToken = localStorageService.getFromLocalStorage("tokendetails").refresh_token;
                httpService.cancelAuthorization();
                httpService.post( "/fineract-provider/api/oauth/token?&client_id=community-app&grant_type=refresh_token&client_secret=123&refresh_token=" + refreshToken)
                    .success(updateAccessDetails);
            }

            this.authenticateWithUsernamePassword = function (credentials) {
                scope.$broadcast("UserAuthenticationStartEvent");
        		if(SECURITY === 'oauth'){
	                httpService.post( "/fineract-provider/api/oauth/token?username=" + credentials.username + "&password=" + credentials.password +"&client_id=community-app&grant_type=password&client_secret=123")
	                    .success(getUserDetails)
	                    .error(onLoginFailure);
        		} else {
	                httpService.post(apiVer + "/authentication?username=" + credentials.username + "&password=" + credentials.password)
	                    .success(onLoginSuccess)
	                    .error(onLoginFailure);
        		}
            };

            var onTwoFactorRememberMe = function (userData, tokenData) {
                var accessToken = tokenData.token;
                twoFactorAccessToken = accessToken;
                httpService.setTwoFactorAccessToken(accessToken);
                scope.$broadcast("UserAuthenticationSuccessEvent", userData);
                localStorageService.addToLocalStorage('userData', userData);
            };

            var onOTPValidateSuccess = function (data) {
                var accessToken = data.token;
                if(twoFactorIsRememberMeRequest) {
                    saveTwoFactorTokenToStorage(userData.username, data);
                }
                twoFactorAccessToken = accessToken;
                httpService.setTwoFactorAccessToken(accessToken);
                scope.$broadcast("UserAuthenticationSuccessEvent", userData);
                localStorageService.addToLocalStorage('userData', userData);
            };

            var onOTPValidateError = function (data, status) {
                scope.$broadcast("TwoFactorAuthenticationFailureEvent", data, status);
            };

            var getTokenFromStorage = function (user) {
                var twoFactorStorage = localStorageService.getFromLocalStorage("twofactor");

                if(twoFactorStorage) {
                    return twoFactorStorage[user]
                }
                return null;
            };

            var saveTwoFactorTokenToStorage = function (user, tokenData) {
                var storageData = localStorageService.getFromLocalStorage("twofactor");
                if(!storageData) {
                    storageData = {}
                }
                storageData[user] = tokenData;
                localStorageService.addToLocalStorage('twofactor', storageData);
            };

            var removeTwoFactorTokenFromStorage = function (username) {
                var storageData = localStorageService.getFromLocalStorage("twofactor");
                if(!storageData) {
                    return;
                }

                delete storageData[username]
                localStorageService.addToLocalStorage('twofactor', storageData);
            };

            var hasValidTwoFactorToken = function (user) {
                var token = getTokenFromStorage(user);
                if(token) {
                    return (new Date).getTime() + 7200000 < token.validTo;
                }
                return false;
            };

            this.validateOTP = function (token, rememberMe) {
                twoFactorIsRememberMeRequest = rememberMe;
                httpService.post(apiVer + "/twofactor/validate?token=" + token)
                    .success(onOTPValidateSuccess)
                    .error(onOTPValidateError);
            };

            scope.$on("OnUserPreLogout", function (event) {
                var userDate = localStorageService.getFromLocalStorage("userData");

                // Remove user data and two-factor access token if present
                localStorageService.removeFromLocalStorage("userData");
                removeTwoFactorTokenFromStorage(userDate.username);

                httpService.post(apiVer + "/twofactor/invalidate", '{"token": "' + twoFactorAccessToken + '"}');
            });
        }
    });
    mifosX.ng.services.service('AuthenticationService', ['$rootScope', 'HttpService', 'SECURITY', 'localStorageService','$timeout','webStorage', mifosX.services.AuthenticationService]).run(function ($log) {
        $log.info("AuthenticationService initialized");
    });
}(mifosX.services || {}));
