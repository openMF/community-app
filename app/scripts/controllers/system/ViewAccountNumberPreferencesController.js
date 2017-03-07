(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAccountNumberPreferencesController: function (scope, resourceFactory, location,routeParams,$uibModal) {
            scope.resourceId = routeParams.id;
            scope.addPrefix = false;
            resourceFactory.accountNumberResources.get({accountNumberFormatId:scope.resourceId},function(data){
                scope.accountType = data["accountType"].value;
                scope.prefixType = data["prefixType"].value;
                if(scope.prefixType != null){
                    scope.addPrefix = true;
                }
            });

            scope.cancel = function(){
                location.path('/accountnumberpreferences');
            }

            scope.editPreferences = function(){
                location.path('/editaccountnumberpreferences/'+ scope.resourceId);
            }

            var DeleteCtrl = function($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.accountNumberResources.delete({accountNumberFormatId:scope.resourceId},function(data){
                        location.path('/accountnumberpreferences');
                    });
                    $uibModalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            scope.deletePreferences = function(){
                $uibModal.open({
                    templateUrl: 'deletepreferences.html',
                    controller: DeleteCtrl
                });
            }

        }
    });
    mifosX.ng.application.controller('ViewAccountNumberPreferencesController', ['$scope', 'ResourceFactory', '$location','$routeParams','$uibModal',mifosX.controllers.ViewAccountNumberPreferencesController]).run(function ($log) {
        $log.info("ViewAccountNumberPreferencesController initialized");
    });
}(mifosX.controllers || {}));
