(function (module) {
    mifosX.services = _.extend(module, {
        SessionManager: function (webStorage, httpService, SECURITY, resourceFactory, localStorageService) {
            var EMPTY_SESSION = {};

            this.get = function (data) {
                var isOauth = SECURITY === 'oauth';
		        var accessToken = null;
                if(isOauth){
                    accessToken = localStorageService.getFromLocalStorage("tokendetails").access_token;
                }
                if (data.shouldRenewPassword) {
                    if(isOauth){
                        httpService.setAuthorization(data.accessToken);
                    } else {
                        httpService.setAuthorization(data.base64EncodedAuthenticationKey);
                    }
                } else {
                    if(isOauth){
                        webStorage.add("sessionData", {userId: data.userId, authenticationKey: data.accessToken, userPermissions: data.permissions});
                        httpService.setAuthorization(data.accessToken, true);
                    } else {
                        webStorage.add("sessionData", {userId: data.userId, authenticationKey: data.base64EncodedAuthenticationKey, userPermissions: data.permissions});
                        httpService.setAuthorization(data.base64EncodedAuthenticationKey, false);
                    }
                    return {user: new mifosX.models.LoggedInUser(data)};
                };
            }

            this.clear = function () {
                webStorage.remove("sessionData");
                httpService.cancelAuthorization();
                return EMPTY_SESSION;
            };

            this.restore = function (handler) {
                var sessionData = webStorage.get('sessionData');
                if (sessionData !== null) {
                    var isOauth = SECURITY === 'oauth';
                    httpService.setAuthorization(sessionData.authenticationKey, isOauth);
                    resourceFactory.userResource.get({userId: sessionData.userId}, function (userData) {
                        userData.userPermissions = sessionData.userPermissions;
                        handler({user: new mifosX.models.LoggedInUser(userData)});
                    });
                } else {
                    handler(EMPTY_SESSION);
                }
            };
        }
    });
    mifosX.ng.services.service('SessionManager', [
            'webStorage',
            'HttpService',
            'SECURITY',
            'ResourceFactory',
            'localStorageService',
            mifosX.services.SessionManager
        ]).run(function ($log) {
            $log.info("SessionManager initialized");
        });
}(mifosX.services || {}));
