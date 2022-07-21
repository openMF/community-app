(function(module) {
    mifosX.services = _.extend(module, {
        NotificationResponseHeaderProvider: function ($rootScope) {
            return {
                'response': function (response) {
                    var method = response.config.method;
                    var url = response.config.url;
                    if (!url.includes("notifications")) {
                        $rootScope.$broadcast('eventFired', {
                            notificationStatus: response.headers('X-Notification-Refresh')
                        });
                    }
                    return response;
                }
            }
        }
    });
    mifosX.ng.services.config(function ($provide, $httpProvider) {
        $provide.factory('NotificationResponseHeaderFactory', mifosX.services.NotificationResponseHeaderProvider);
        $httpProvider.interceptors.push(mifosX.services.NotificationResponseHeaderProvider);
    }).run(function ($log) {
        $log.info("NotificationResponseHeaderFactory initialized");
    })
}(mifosX.services || {}));
