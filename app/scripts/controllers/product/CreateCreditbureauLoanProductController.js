(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCreditBureauLoanProductController: function (scope, routeParams, resourceFactory, location) {
            scope.formData = {};
            scope.formData.isCreditcheckMandatory = false;
            scope.formData.skipCreditcheckInFailure = false;
            scope.formData.isActive = false;
            resourceFactory.loanProductResource.getAllLoanProducts(function (data) {
                scope.products = data;
            });
            resourceFactory.creditBureauResource.get(function (data) {
                scope.creditBureauProducts = data;
            });

            scope.cancel = function () {
                location.path('/creditbureauloanproducts');
            };

            scope.submit = function () {
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
                resourceFactory.creditBureauLoanProductResource.save({productId: scope.formData.loanProductId},this.formData, function (data) {
                    location.path('/viewcreditbureauloanproduct/' + scope.formData.loanProductId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateCreditBureauLoanProductController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.CreateCreditBureauLoanProductController]).run(function ($log) {
        $log.info("CreateCreditBureauLoanProductController initialized");
    });
}(mifosX.controllers || {}));