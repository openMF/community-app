(function (module) {
    mifosX.controllers = _.extend(module, {
        ListFamilyDetailController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            scope.clientId = routeParams.clientId;

            resourceFactory.familyDetails.getAll({clientId: scope.clientId}, function (data) {
                scope.familyMembers = data;
            });

            scope.routeTo = function (id) {
                location.path('/clients/' + scope.clientId + '/viewfamilydetails/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/clients/' + scope.clientId + '/editfamilydetails/' + id);
            };

            var FamilyDetailsDeleteCtrl = function ($scope, $modalInstance, familyDetailsId) {
                $scope.delete = function () {
                    resourceFactory.familyDetails.delete({
                        clientId: scope.clientId,
                        familyDetailId: familyDetailsId
                    }, {}, function (data) {
                        $modalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.deleteFamilyDetail = function (id) {
                $modal.open({
                    templateUrl: 'deletefamilydetail.html',
                    controller: FamilyDetailsDeleteCtrl,
                    resolve: {
                        familyDetailsId: function () {
                            return id;
                        }
                    }
                });
            };
        }

    });
    mifosX.ng.application.controller('ListFamilyDetailController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.ListFamilyDetailController]).run(function ($log) {
        $log.info("ListFamilyDetailController initialized");
    });

}(mifosX.controllers || {}));