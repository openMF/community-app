(function (module) {
    mifosX.controllers = _.extend(module, {
        CollateralController: function (scope, resourceFactory, location) {
            scope.formData = [];
            scope.collaterals = [];
            scope.isPresiousMetal = 1;
            scope.isPresiousStone = 2;

            resourceFactory.collateralsResource.getAll(function(data){
                scope.collaterals = data;
            });

            scope.editcollateral = function(collateralId){
                location.path("editcollateral/" + collateralId);
            }


        }
    });



    mifosX.ng.application.controller('CollateralController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CollateralController]).run(function ($log) {
        $log.info("CollateralController initialized");
    });
}(mifosX.controllers || {}));