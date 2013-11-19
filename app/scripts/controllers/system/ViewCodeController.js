(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewCodeController: function(scope, routeParams , resourceFactory, location,$modal,route ) {
                   scope.codevalues = [];
             resourceFactory.codeResources.get({codeId: routeParams.id} , function(data) {
                scope.code = data;
            });
            resourceFactory.codeValueResource.getAllCodeValues({codeId: routeParams.id} , function(data) {
                scope.codevalues = data;
            });
            scope.delCode = function (){
                $modal.open({
                    templateUrl: 'deletecode.html',
                    controller: CodeDeleteCtrl
                });
            };
            var CodeDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.codeResources.delete({codeId: routeParams.id},{},function(data){
                        location.path('/codes');
                    });
                    $modalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.deleteCodeValue = function (id){
                $modal.open({
                    templateUrl: 'deletecodevalue.html',
                    controller: CodeValueDeleteCtrl,
                    resolve: {
                        cvid: function () {
                            return id;
                        }
                    }
                });
            };
            var CodeValueDeleteCtrl = function ($scope, $modalInstance,cvid) {
                $scope.delete = function () {
                    resourceFactory.codeValueResource.delete({codeId: routeParams.id,codevalueId: cvid},{},function(data){
                        route.reload();
                    });
                    $modalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewCodeController', ['$scope', '$routeParams','ResourceFactory','$location','$modal','$route', mifosX.controllers.ViewCodeController]).run(function($log) {
        $log.info("ViewCodeController initialized");
    });
}(mifosX.controllers || {}));
