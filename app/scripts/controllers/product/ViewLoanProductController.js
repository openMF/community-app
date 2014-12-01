(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanProductController: function (scope, routeParams, location, anchorScroll, resourceFactory) {
            scope.loanproduct = [];
            scope.isAccountingEnabled = false;
            scope.isAccrualAccountingEnabled = false;

            resourceFactory.loanProductResource.get({loanProductId: routeParams.id, template: 'true'}, function (data) {
                scope.loanproduct = data;
                if (data.accountingRule.id == 2 || data.accountingRule.id == 3 || data.accountingRule.id == 4) {
                    scope.isAccountingEnabled = true;
                }

                if (data.accountingRule.id == 3 || data.accountingRule.id == 4) {
                    scope.isAccrualAccountingEnabled = true;
                }
                if(scope.loanproduct.loanProductConfigurableAttributes != null &&
                    scope.loanproduct.loanProductConfigurableAttributes.allowAttributeConfiguration){
                    scope.allowAttributeConfiguration = scope.loanproduct.loanProductConfigurableAttributes.allowAttributeConfiguration;
                    scope.configureAmortization = scope.loanproduct.loanProductConfigurableAttributes.configureAmortization;
                    scope.configureArrearsTolerance = scope.loanproduct.loanProductConfigurableAttributes.configureArrearsTolerance;
                    scope.configureGraceOnArrearsAging = scope.loanproduct.loanProductConfigurableAttributes.configureGraceOnArrearsAging;
                    scope.configureInterestCalcPeriod = scope.loanproduct.loanProductConfigurableAttributes.configureInterestCalcPeriod;
                    scope.configureInterestMethod = scope.loanproduct.loanProductConfigurableAttributes.configureInterestMethod;
                    scope.configureMoratorium = scope.loanproduct.loanProductConfigurableAttributes.configureMoratorium;
                    scope.configureRepaymentFrequency = scope.loanproduct.loanProductConfigurableAttributes.configureRepaymentFrequency;
                    scope.configureRepaymentStrategy = scope.loanproduct.loanProductConfigurableAttributes.configureRepaymentStrategy;
                    scope.allowAttributeConfiguration = scope.loanproduct.loanProductConfigurableAttributes.allowAttributeConfiguration;
                }
                else{
                    scope.allowAttributeConfiguration = false;
                }

            });

            scope.scrollto = function (link) {
                location.hash(link);
                anchorScroll();

            };

        }
    });
    mifosX.ng.application.controller('ViewLoanProductController', ['$scope', '$routeParams', '$location', '$anchorScroll' , 'ResourceFactory', mifosX.controllers.ViewLoanProductController]).run(function ($log) {
        $log.info("ViewLoanProductController initialized");
    });
}(mifosX.controllers || {}));
