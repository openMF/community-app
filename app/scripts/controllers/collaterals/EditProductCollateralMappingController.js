(function (module) {
    mifosX.controllers = _.extend(module, {
        EditProductCollateralMappingController: function (scope, resourceFactory, location, routeParams) {
            scope.formData = {};
            resourceFactory.productCollateralsMappingResource.get({loanProductId: routeParams.loanProductId,productCollateralMappingId: routeParams.productCollateralMappingId}, function (data) {
                scope.formData.loanProductId = data.product;
                scope.formData.id = data.id;
                scope.formData.collateralId = data.collateral;
                resourceFactory.collateralsResource.getAll(function(collateralData){
                    scope.collaterals = collateralData;
                });
                resourceFactory.loanProductResource.getAllLoanProducts(function(loanData){
                    scope.loanProducts = loanData;
                });
            });



            scope.submit = function () {
                var id = this.formData.id;
                var loanProductId = this.formData.loanProductId;
                this.formData.id = undefined;
                resourceFactory.productCollateralsMappingResource.update({loanProductId: loanProductId, productCollateralMappingId: id}, this.formData, function (data) {
                    location.path('/viewproductcollateralmapping');
                });
            };

            scope.cancel = function () {
                location.path('/viewproductcollateralmapping');
            };
        }
    });



    mifosX.ng.application.controller('EditProductCollateralMappingController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.EditProductCollateralMappingController]).run(function ($log) {
        $log.info("EditProductCollateralMappingController initialized");
    });
}(mifosX.controllers || {}));


