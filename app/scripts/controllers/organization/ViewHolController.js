(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewHolController: function (scope, routeParams, resourceFactory, $uibModal, location, route) {

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
                $uibModal.open({
                    templateUrl: 'activateHoliday.html',
                    controller: activateHolidayCtrl
                });
            };

            var activateHolidayCtrl = function ($scope, $uibModalInstance) {
                $scope.activate = function () {
                    resourceFactory.holValueResource.save({holId: routeParams.id, command: 'Activate'}, {}, function (data) {
                        $uibModalInstance.close('activate');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.deleteHoliday = function () {
                $uibModal.open({
                    templateUrl: 'deleteHoliday.html',
                    controller: deleteHolidayCtrl
                });
            };

            var deleteHolidayCtrl = function ($scope, $uibModalInstance) {
                $scope.activate = function () {
                    resourceFactory.holValueResource.delete({holId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('activate');
                        location.path('holidays');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewHolController', ['$scope', '$routeParams', 'ResourceFactory', '$uibModal', '$location', '$route', mifosX.controllers.ViewHolController]).run(function ($log) {
        $log.info("ViewHolController initialized");
    });
}(mifosX.controllers || {}));

