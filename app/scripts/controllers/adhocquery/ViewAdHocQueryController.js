(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAdHocQueryController: function (scope, routeParams, route, location, resourceFactory, $modal) {
            scope.adhocquery = [];
            scope.formData = {};
            resourceFactory.adHocQueryResource.get({'adHocId': routeParams.id}, function (data) {
                scope.adhocquery = data;
            });
            
            scope.deleteadhocquery = function () {
                $modal.open({
                    templateUrl: 'deleteadhocquery.html',
                    controller: AdHocDeleteCtrl
                });
            };
            var AdHocDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.adHocQueryResource.delete({adHocId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/adhocquery');
                        // added dummy request param because Content-Type header gets removed
                        // if the request does not contain any data (a request body)
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewAdHocQueryController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$modal', mifosX.controllers.ViewAdHocQueryController]).run(function ($log) {
        $log.info("ViewAdHocQueryController initialized");
    });
}(mifosX.controllers || {}));
