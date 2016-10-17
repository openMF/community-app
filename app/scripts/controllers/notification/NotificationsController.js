(function (module) {
    mifosX.controllers = _.extend(module, {
        NotificationsController: function (scope, rootScope, resourceFactory, location, timeout,
                                           notificationResponseHeaderFactory, localStorageService) {
            var objTypeUrlMap = {
                'client' : '/viewclient/',
                'group' : '/viewgroup/',
                'loan' : '/viewloanaccount/',
                'shareAccount' : '/viewshareaccount/',
                'fixedDeposit' : 'viewfixeddepositaccount/',
                'recurringDepositAccount': '/viewrecurringdepositaccount/',
                'shareProduct': '/viewshareproduct/',
                'savingsAccount' : '/viewsavingaccount/',
                'center' : '/viewcenter/',
                'loanProduct' : '/viewloanproduct/'
            };
            scope.notifications = [];
            scope.notificationsPerPage = 15;
            scope.notificationsItmesInATray = 5;
            scope.isNotificationIconRed = false;
            scope.numberOfUnreadNotifications = 0;
            scope.counter = 0;
            scope.initNotificationTray = function() {
                var readNotifications = localStorageService.getFromLocalStorage("notifications");
                if (readNotifications == null) {
                    scope.initNotificationsPage();
                } else {
                    scope.notifications = readNotifications;
                }

                if (scope.numberOfUnreadNotifications > 0 ) {
                    resourceFactory.notificationsResource.update();
                    scope.numberOfUnreadNotifications = 0;
                }
            };
            scope.initNotificationsPage = function () {
                var items = resourceFactory.notificationsResource.getAllNotifications({
                    offset: 0,
                    limit: scope.notificationsPerPage || 10
                }, function (data) {
                    scope.totalNotifications = data.totalFilteredRecords;
                    scope.notifications = data.pageItems;
                    localStorageService.addToLocalStorage("notifications", JSON.stringify(scope.notifications));
                });
            };
            scope.getResultsPage = function (pageNumber) {
                var items = resourceFactory.notificationsResource.getAllNotifications({
                    offset : ((pageNumber-1) * scope.notificationsPerPage),
                    limit: scope.notificationsPerPage
                }, function (data) {
                    scope.notifications = data.pageItems;
                });
            };
            scope.fetchUnreadNotifications = function() {
                var items = resourceFactory.notificationsResource.getAllUnreadNotifications({
                    offset: 0,
                    limit: scope.notificationsPerPage || 10
                }, function(data) {
                    scope.numberOfUnreadNotifications = data.pageItems.length;
                    scope.counter = 0;
                    var readNotifications = localStorageService.getFromLocalStorage("notifications");
                    if (readNotifications == null) {
                        scope.initNotificationsPage();
                    } else {
                        for (j = 0; j < data.pageItems.length; j++) {
                            for (i = 0; i < readNotifications.length; i++) {
                                if (JSON.stringify(readNotifications[i]) === JSON.stringify(data.pageItems[j])) {
                                    readNotifications.splice(i, 1);
                                }
                            }
                        }
                        scope.notifications = data.pageItems.concat
                        (readNotifications
                            .slice(0, Math.abs(readNotifications.length - data.pageItems.length + 1)));
                    }
                    localStorageService.addToLocalStorage("notifications", JSON.stringify(scope.notifications));
                });
             };
            scope.navigateToAction = function(notification) {
                if(!notification.objectType || typeof(notification.objectType) !=='string'){
                    console.error('no object type found');
                    return;
                }
                if(!objTypeUrlMap[notification.objectType] ){
                    return;
                }
                location.path(objTypeUrlMap[notification.objectType] + notification.objectId);
            };
            scope.countFromLastResponse = function() {
                scope.counter++;
                if (scope.counter == 60) {
                    scope.counter = 0;
                    scope.fetchUnreadNotifications();
                }
                scope.timer = timeout(scope.countFromLastResponse, 1000);
            };
            scope.fetchItemsInNotificationTray = function() {
                  scope.initNotificationTray();
            };
            scope.$on('eventFired', function(event, data) {
                scope.counter = 0;
                if (data.notificationStatus === "true") {
                    scope.fetchUnreadNotifications();
                }
            });
            scope.$on("UserAuthenticationSuccessEvent", function (event, data) {
                timeout.cancel(scope.timer);
                localStorageService.removeFromLocalStorage("notifications"); //remove all local notifications
                timeout(scope.countFromLastResponse(), 1000);
                scope.fetchUnreadNotifications();
            });
        }
    });
    mifosX.ng.application.controller('NotificationsController', ['$scope', '$rootScope', 'ResourceFactory', '$location',
        '$timeout', 'NotificationResponseHeaderFactory' , 'localStorageService', mifosX.controllers.NotificationsController])
        .run(function ($log) {
        $log.info("NotificationsController initialized");
    });
}(mifosX.controllers || {}));
