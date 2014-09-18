(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewHookController: function (scope, routeParams, route, location, resourceFactory, $modal) {
            scope.hook = [];
            scope.formData = {};
            resourceFactory.hookResources.get({hookId: routeParams.id}, function (data) {
                scope.hook = data;
            });
            scope.deletehook = function () {
                $modal.open({
                    templateUrl: 'deletehook.html',
                    controller: HookDeleteCtrl
                });
            };

            var HookDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.hookResources.delete({hookId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/hooks');
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
    mifosX.ng.application.controller('ViewHookController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$modal', mifosX.controllers.ViewHookController]).run(function ($log) {
        $log.info("ViewHookController initialized");
    });
}(mifosX.controllers || {}));
