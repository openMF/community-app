(function (module) {
    mifosX.controllers = _.extend(module, {
        CreditBureauSummaryController: function (scope, rootScope, http, API_VERSION, resourceFactory, routeParams,location) {

            scope.lpId=routeParams.productId;



            resourceFactory.creditBureauByLoanProductId.get({loanProductId: scope.lpId}, function (data) {
                scope.creditBureauByLoanProduct = data;
                scope.cbId = scope.creditBureauByLoanProduct.organisationCreditBureauId;
                scope.cbname = scope.creditBureauByLoanProduct.alias;
                scope.lpId = scope.creditBureauByLoanProduct.loanProductId;
                scope.lpName = scope.creditBureauByLoanProduct.loanProductName;
                scope.cbactive = scope.creditBureauByLoanProduct.isActive;
                scope.cbsummary = scope.creditBureauByLoanProduct.creditbureauSummary;
            });

            scope.routeToCreditBureau=function() {
                if (  scope.cbsummary == '1 - THITSAWORKS - Myanmar' && scope.cbactive == true) {
                    location.path('/creditreport/thitsaworkCreditbureau/'+scope.lpId+'/'+scope.cbId);
                }

            };
            scope.cancel=function() {
                    location.path('/viewloanaccount/'+scope.lpId);
            };

        }
    });
    mifosX.ng.application.controller('CreditBureauSummaryController', ['$scope', '$rootScope','$http','API_VERSION', 'ResourceFactory','$routeParams', '$location', mifosX.controllers.CreditBureauSummaryController]).run(function ($log) {
        $log.info("CreditBureauSummaryController initialized");
    });
}(mifosX.controllers || {}));
