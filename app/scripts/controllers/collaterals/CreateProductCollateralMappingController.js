(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateProductCollateralMappingController: function (scope, resourceFactory, location, routeParams) {
            scope.formData = {};

            resourceFactory.collateralsResource.getAll(function(data){
                scope.collaterals = data;
            });

            resourceFactory.loanProductResource.getAllLoanProducts(function(data){
                scope.loanProducts = data;
            });

            scope.submit = function () {
                resourceFactory.productCollateralsMappingResource.save(this.formData, function (data) {
                    location.path('/viewproductcollateralmapping');
                });
            }

            scope.cancel = function () {
                location.path('/viewproductcollateralmapping');
            }
        }
    });



    mifosX.ng.application.controller('CreateProductCollateralMappingController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.CreateProductCollateralMappingController]).run(function ($log) {
        $log.info("CreateProductCollateralMappingController initialized");
    });
}(mifosX.controllers || {}));

