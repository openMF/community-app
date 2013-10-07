(function(module) {
    mifosX.controllers = _.extend(module, {
        ProductMixController: function(scope, resourceFactory) {
            scope.productmixes = [];
            resourceFactory.loanProductResource.getAllLoanProducts({associations:'productMixes'},function(data) {
                scope.productmixes = data;
            });
        }
    });
    mifosX.ng.application.controller('ProductMixController', ['$scope', 'ResourceFactory', mifosX.controllers.ProductMixController]).run(function($log) {
        $log.info("ProductMixController initialized");
    });
}(mifosX.controllers || {}));
