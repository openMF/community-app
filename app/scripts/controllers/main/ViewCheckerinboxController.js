(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewCheckerinboxController: function(scope, resourceFactory, routeParams,location,$modal) {
            scope.details = {};
            resourceFactory.auditResource.get({templateResource: routeParams.id} , function(data) {
                scope.details = data;
                scope.commandAsJson = data.commandAsJson;
                var obj = JSON.parse(scope.commandAsJson);
                scope.jsondata = [];
                _.each(obj,function(value,key){
                    scope.jsondata.push({name:key,property:value});
                });
            });
            scope.checkerApprove = function () {
                $modal.open({
                    templateUrl: 'approve.html',
                    controller: ApproveCtrl
                });
            };
            var ApproveCtrl = function ($scope, $modalInstance) {

                $scope.approve = function () {
                    resourceFactory.checkerInboxResource.save({templateResource: routeParams.id,command:'approve'},{}, function(data){
                      location.path('/checkeractionperformed');
                    });
                    $modalInstance.close('approve');
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
                    resourceFactory.checkerInboxResource.delete({templateResource: routeParams.id}, {}, function(data){
                        location.path('/checkeractionperformed');
                    });
                    $modalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ViewCheckerinboxController', ['$scope', 'ResourceFactory', '$routeParams','$location','$modal', mifosX.controllers.ViewCheckerinboxController]).run(function($log) {
        $log.info("ViewCheckerinboxController initialized");
    });
}(mifosX.controllers || {}));


