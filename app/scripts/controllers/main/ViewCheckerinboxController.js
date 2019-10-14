(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCheckerinboxController: function (scope, resourceFactory, routeParams, location, $uibModal) {
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
                $uibModal.open({
                    templateUrl: 'approve.html',
                    controller: ApproveCtrl,
                    resolve: {
                        action: function () {
                            return action;
                        }
                    }
                });
            };
            var ApproveCtrl = function ($scope, $uibModalInstance, action) {
                $scope.approve = function () {
                    resourceFactory.checkerInboxResource.save({templateResource: routeParams.id, command: action}, {}, function (data) {
                        $uibModalInstance.close('approve');
                        location.path('/checkeractionperformed');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

			scope.checkerReject = function (action) {
                $uibModal.open({
                    templateUrl: 'reject.html',
                    controller: RejectCtrl,
                    resolve: {
                        action: function () {
                            return action;
                        }
                    }
                });
            };
			var RejectCtrl = function ($scope, $uibModalInstance, action) {
                $scope.reject = function () {
                    resourceFactory.checkerInboxResource.save({templateResource: routeParams.id, command: action}, {}, function (data) {
                        $uibModalInstance.close('reject');
                        location.path('/checkeractionperformed');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.checkerDelete = function () {
                $uibModal.open({
                    templateUrl: 'delete.html',
                    controller: DeleteCtrl
                });
            };
            var DeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.checkerInboxResource.delete({templateResource: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/checkeractionperformed');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewCheckerinboxController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewCheckerinboxController]).run(function ($log) {
        $log.info("ViewCheckerinboxController initialized");
    });
}(mifosX.controllers || {}));