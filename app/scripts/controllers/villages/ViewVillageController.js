(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewVillageController: function (scope, routeParams, location, resourceFactory, dateFilter, route, $modal) {
            scope.village = {};
            scope.addressId ;

            resourceFactory.villageResource.get({villageId: routeParams.id, associations: 'setOfCenters'}, function (data) {

                scope.village = data;
                scope.activationDate = new Date(scope.village.timeline.activatedOnDate);
                scope.village.timeline.activatedOnDate = dateFilter(scope.activationDate, scope.df);
                scope.submittedDate = new Date(scope.village.timeline.submittedOnDate);
                scope.village.timeline.submittedOnDate = dateFilter(scope.submittedDate, scope.df);
            });

            scope.deleteVillage = function () {
                $modal.open({
                    templateUrl: 'deletevillage.html',
                    controller: VillageDeleteCtrl
                });
            };
            var VillageDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.villageResource.delete({villageId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/villages');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.deleteVillageAddress = function (addressId) {
                scope.addressId = addressId;
                $modal.open({
                    templateUrl: 'deletevillageaddress.html',
                    controller: VillageAddressDeleteCtrl
                });
            }
            scope.entityType = "villages";
            var VillageAddressDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.entityAddressResource.delete({entityType: scope.entityType, entityId: routeParams.id, addressId: scope.addressId}, function (response) {
                        $modalInstance.close('delete');
                        if(response != null) {
                            route.reload();
                        }
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.changeState = function (disabled) {
                resourceFactory.villageResource.update({'villageId': routeParams.id}, {disabled: !disabled}, function (data) {
                    route.reload();
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewVillageController', ['$scope', '$routeParams', '$location', 'ResourceFactory', 'dateFilter', '$route', '$modal', mifosX.controllers.ViewVillageController]).run(function ($log) {
        $log.info("ViewVillageController initialized");
    });
}(mifosX.controllers || {}));
