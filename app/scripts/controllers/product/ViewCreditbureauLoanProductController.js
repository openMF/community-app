(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCreditBureauLoanProductController: function (scope, routeParams, resourceFactory, location) {
            resourceFactory.loanProductResource.getCreditbureauLoanProducts({loanProductId: routeParams.loanProductId,associations: 'creditBureaus'},function (data) {
                scope.creditbureauLoanProduct = data;
            });

            scope.routeTo = function (loanProductId) {
                location.path('/viewcreditbureauloanproduct/' + loanProductId);
            };

            if (!scope.searchCriteria.loanP) {
                scope.searchCriteria.loanP = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.loanP;

            scope.onFilter = function () {
                scope.searchCriteria.loanP = scope.filterText;
                scope.saveSC();
            };

            scope.changeStatus = function () {
                if(scope.creditbureauLoanProduct.isActive){
                    resourceFactory.creditBureauLoanProductResource.inactivate({productId: routeParams.loanProductId,creditBureauId :scope.creditbureauLoanProduct.id},function (data) {
                        scope.creditbureauLoanProduct.isActive = data.changes.isActive;
                    });
                }else{
                    resourceFactory.creditBureauLoanProductResource.activate({productId: routeParams.loanProductId,creditBureauId :scope.creditbureauLoanProduct.id},function (data) {
                        scope.creditbureauLoanProduct.isActive = data.changes.isActive;
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('ViewCreditBureauLoanProductController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.ViewCreditBureauLoanProductController]).run(function ($log) {
        $log.info("ViewCreditBureauLoanProductController initialized");
    });
}(mifosX.controllers || {}));