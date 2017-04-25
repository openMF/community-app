(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewProvisioningCriteriaController: function (scope, routeParams, resourceFactory, location, $uibModal) {
            scope.charge = [];
            scope.choice = 0;
            var temp = "" ;
            var i = 0 ;
            resourceFactory.provisioningcriteria.get({criteriaId: routeParams.criteriaId}, function (data) {
                scope.loanproducts = data.loanProducts ;
                scope.definitions = data.definitions;
                scope.criterianame = data.criteriaName ;
                scope.criteriaId = data.criteriaId ;
                var length = data.loanProducts.length;
                for(i = 0 ; i < length; i++) {
                    temp = temp.concat(data.loanProducts[i].name) ;
                    if(i < (length-1)) {
                        temp = temp.concat(", ") ;
                    }
                }
            scope.formattedProductNames = temp ;
            });

            scope.deleteProvisionigCriteria = function () {
                $uibModal.open({
                    templateUrl: 'deletech.html',
                    controller: criteriaDeleteCtrl
                });
            };


            var criteriaDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.provisioningcriteria.delete({criteriaId: scope.criteriaId}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/viewallprovisionings/');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewProvisioningCriteriaController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewProvisioningCriteriaController]).run(function ($log) {
        $log.info("ViewProvisioningCriteriaController initialized");
    });
}(mifosX.controllers || {}));
