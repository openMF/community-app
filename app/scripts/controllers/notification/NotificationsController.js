(function (module) {
    mifosX.controllers = _.extend(module, {
        NotificationsController: function (scope, rootScope, resourceFactory, location, notificationResponseHeaderFactory) {
            scope.notifications = [];
            scope.notificationsPerPage = 15;
            scope.getResultsPage = function (pageNumber) {
                var items = resourceFactory.notificationsResource.getAllNotifications({
                    offset : ((pageNumber-1) * scope.notificationsPerPage),
                    limit: scope.notificationsPerPage
                }, function (data) {
                    scope.notifications = data.pageItems;
                });
            };
            scope.initPage = function () {
                var items = resourceFactory.notificationsResource.getAllNotifications({
                    offset: 0,
                    limit: scope.notificationsPerPage
                }, function (data) {
                    scope.totalNotifications = data.totalFilteredRecords;
                    scope.notifications = data.pageItems;
                });
            };
            scope.initPage();
            console.log(notificationResponseHeaderFactory.response);
        }
    });
    mifosX.ng.application.controller('NotificationsController', ['$scope', '$rootScope', 'ResourceFactory', '$location',
        'NotificationResponseHeaderFactory' ,mifosX.controllers.NotificationsController]).run(function ($log, $rootScope) {
        $log.info("NotificationsController initialized");
        $rootScope.$on('eventFired', function(event, data) {
            console.log(data);
        });
    });
}(mifosX.controllers || {}));
