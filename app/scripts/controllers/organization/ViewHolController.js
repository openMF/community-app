(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewHolController: function (scope, routeParams, resourceFactory, $modal, location, route) {

            resourceFactory.holValueResource.getholvalues({officeId: 1, holId: routeParams.id}, function (data) {
                scope.holiday = data;
                if (data.status.value === "Pending for activation") {
                    scope.holidayStatusPending = true;
                } else if (data.status.value === "Active") {
                    scope.holidayStatusActive = true;
                } else if (data.status.value === "Deleted") {
                    scope.holidayStatusDeleted = true;
                }

            });

            scope.activateHoliday = function () {
                $modal.open({
                    templateUrl: 'activateHoliday.html',
                    controller: activateHolidayCtrl
                });
            };

            var activateHolidayCtrl = function ($scope, $modalInstance) {
                $scope.activate = function () {
                    resourceFactory.holValueResource.save({holId: routeParams.id, command: 'Activate'}, {}, function (data) {
                        $modalInstance.close('activate');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.deleteHoliday = function () {
                $modal.open({
                    templateUrl: 'deleteHoliday.html',
                    controller: deleteHolidayCtrl
                });
            };

            var deleteHolidayCtrl = function ($scope, $modalInstance) {
                $scope.activate = function () {
                    resourceFactory.holValueResource.delete({holId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('activate');
                        location.path('holidays');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewHolController', ['$scope', '$routeParams', 'ResourceFactory', '$modal', '$location', '$route', mifosX.controllers.ViewHolController]).run(function ($log) {
        $log.info("ViewHolController initialized");
    });
}(mifosX.controllers || {}));

