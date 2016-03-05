(function (module) {
    mifosX.controllers = _.extend(module, {
        ProductCollateralMappingsController: function (scope, resourceFactory, location, routeParams) {

            scope.getAllData = function() {
                resourceFactory.productCollateralsMappingResource.getAll({loanProductId: -1}, function (data) {
                    scope.productcollateralmappings = data;
                });
            }

            scope.getAllData();

            scope.editProductCollateralMappings = function(data){
                location.path('/editproductcollateralmapping/'+data.product+'/'+data.id);
            };

            scope.deleteProductCollateralMappings = function(mapping){
                var id = mapping.id;
                var productId = mapping.product;
                resourceFactory.productCollateralsMappingResource.delete({loanProductId: productId, productCollateralMappingId: id}, function (datas) {
                    scope.getAllData();
                });
            };
        }
    });



    mifosX.ng.application.controller('ProductCollateralMappingsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.ProductCollateralMappingsController]).run(function ($log) {
        $log.info("ProductCollateralMappingsController initialized");
    });
}(mifosX.controllers || {}));
