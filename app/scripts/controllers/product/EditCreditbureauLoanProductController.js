(function (module) {
    mifosX.controllers = _.extend(module, {
        EditCreditbureauLoanProductController: function (scope, routeParams, resourceFactory, location) {
            scope.formData = {};
            resourceFactory.loanProductResource.getAllLoanProducts(function (data) {
                scope.products = data;
                resourceFactory.creditBureauResource.get(function (data) {
                    scope.creditBureauProducts = data;
                    resourceFactory.loanProductResource.getCreditbureauLoanProducts({loanProductId: routeParams.loanProductId,associations: 'creditBureaus'},function (data) {
                        scope.creditBureauId = data.id;
                        scope.formData.creditBureauProductId = data.creditBureauData.creditBureauId;
                        scope.formData.loanProductId = data.loanProductId;
                        scope.formData.stalePeriod = data.stalePeriod;
                        scope.formData.isCreditcheckMandatory = data.isCreditcheckMandatory;
                        scope.formData.skipCreditcheckInFailure = data.skipCreditcheckInFailure;
                        scope.formData.isActive = data.isActive;
                    });
                });
            });


            scope.cancel = function () {
                location.path('/creditbureauloanproducts');
            };

            scope.submit = function () {
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
                resourceFactory.creditBureauLoanProductResource.update({productId: scope.formData.loanProductId, creditBureauId:scope.creditBureauId},this.formData, function (data) {
                    location.path('/viewcreditbureauloanproduct/' + scope.formData.loanProductId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditCreditbureauLoanProductController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditCreditbureauLoanProductController]).run(function ($log) {
        $log.info("EditCreditbureauLoanProductController initialized");
    });
}(mifosX.controllers || {}));