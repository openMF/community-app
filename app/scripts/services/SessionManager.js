(function (module) {
    mifosX.services = _.extend(module, {
        SessionManager: function (webStorage, httpService, resourceFactory) {
            var EMPTY_SESSION = {};

            this.get = function (data) {
                if (data.shouldRenewPassword) {
                    httpService.setAuthorization(data.base64EncodedAuthenticationKey);
                } else{
                    webStorage.add("sessionData", {userId: data.userId, authenticationKey: data.base64EncodedAuthenticationKey, userPermissions: data.permissions});
                    httpService.setAuthorization(data.base64EncodedAuthenticationKey);
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
                    httpService.setAuthorization(sessionData.authenticationKey);
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
            'ResourceFactory',
            mifosX.services.SessionManager
        ]).run(function ($log) {
            $log.info("SessionManager initialized");
        });
}(mifosX.services || {}));
