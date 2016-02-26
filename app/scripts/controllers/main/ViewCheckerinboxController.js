(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCheckerinboxController: function (scope, resourceFactory, routeParams, location, $modal) {
            scope.details = {};
            resourceFactory.auditResource.get({templateResource: routeParams.id}, function (data) {
                scope.details = data;
                scope.commandAsJson = data.commandAsJson;
                var obj = JSON.parse(scope.commandAsJson);
                scope.jsondata = [];
                _.each(obj, function (value, key) {
                    scope.jsondata.push({name: key, property: value});
                });
            });
            scope.checkerApprove = function (action) {
                $modal.open({
                    templateUrl: 'approve.html',
                    controller: ApproveCtrl,
                    resolve: {
                        action: function () {
                            return action;
                        }
                    }
                });
            };
            var ApproveCtrl = function ($scope, $modalInstance, action) {
                $scope.approve = function () {
                    resourceFactory.checkerInboxResource.save({templateResource: routeParams.id, command: action}, {}, function (data) {
                        $modalInstance.close('approve');
                        location.path('/checkeractionperformed');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

			scope.checkerReject = function (action) {
                $modal.open({
                    templateUrl: 'reject.html',
                    controller: RejectCtrl,
                    resolve: {
                        action: function () {
                            return action;
                        }
                    }
                });
            };
			var RejectCtrl = function ($scope, $modalInstance, action) {
                $scope.approve = function () {
                    resourceFactory.checkerInboxResource.save({templateResource: routeParams.id, command: action}, {}, function (data) {
                        $modalInstance.close('reject');
                        location.path('/checkeractionperformed');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.checkerDelete = function () {
                $modal.open({
                    templateUrl: 'delete.html',
                    controller: DeleteCtrl
                });
            };
            var DeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.checkerInboxResource.delete({templateResource: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/checkeractionperformed');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewCheckerinboxController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$modal', mifosX.controllers.ViewCheckerinboxController]).run(function ($log) {
        $log.info("ViewCheckerinboxController initialized");
    });
}(mifosX.controllers || {}));