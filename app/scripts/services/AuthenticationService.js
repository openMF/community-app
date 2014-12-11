(function (module) {
    mifosX.services = _.extend(module, {
        AuthenticationService: function (scope, httpService, localStorageService) {
            var onSuccess = function (data) {
                scope.$broadcast("UserAuthenticationSuccessEvent", data);
                localStorageService.addToLocalStorage('userData', data);
            };

            var onFailure = function (data) {
                scope.$broadcast("UserAuthenticationFailureEvent", data);
            };

            var apiVer = '/mifosng-provider/api/v1';

            this.authenticateWithUsernamePassword = function (credentials) {
                scope.$broadcast("UserAuthenticationStartEvent");
                httpService.post(apiVer + "/authentication?username=" + credentials.username + "&password=" + credentials.password)
                    .success(onSuccess)
                    .error(onFailure);
            };
        }
    });
    mifosX.ng.services.service('AuthenticationService', ['$rootScope', 'HttpService', 'localStorageService', mifosX.services.AuthenticationService]).run(function ($log) {
        $log.info("AuthenticationService initialized");
    });
}(mifosX.services || {}));
