(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewProvisioningCriteriaController: function (scope, routeParams, resourceFactory, location, $modal) {
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
                $modal.open({
                    templateUrl: 'deletech.html',
                    controller: criteriaDeleteCtrl
                });
            };


            var criteriaDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.provisioningcriteria.delete({criteriaId: scope.criteriaId}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/viewallprovisionings/');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewProvisioningCriteriaController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', mifosX.controllers.ViewProvisioningCriteriaController]).run(function ($log) {
        $log.info("ViewProvisioningCriteriaController initialized");
    });
}(mifosX.controllers || {}));
