/**
 * Created by conflux37 on 9/1/2016.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateTransactionAuthentication: function (scope, resourceFactory, location, dateFilter, translate) {
            scope.transactionAuthenticationAppliesTo = [];
            scope.paymentOptions = [];
            scope.loanTransactionTypeOptions = [];
            scope.savingsTransactionTypeoptions = [];
            scope.availableAuthenticationServices = [];
            scope.paymentOptions = [];
            scope.transactionTypeOptions = [];
            scope.formdata = {};

            resourceFactory.transactionAuthenticationTemplateResource.getTemplate(function (data) {
                scope.transactionAuthenticationAppliesTo = data.transactionAuthenticationAppliesTo;
                scope.paymentOptions = data.paymentOptions;
                scope.loanTransactionTypeOptions = data.loanTransactionTypeOptions;
                scope.savingsTransactionTypeoptions = data.savingsTransactionTypeoptions;
                scope.availableAuthenticationServices = data.availableAuthenticationServices;
            });

            scope.transactionTypeAppliesToSelected = function (transactionTypeAppliesTo) {
                switch(transactionTypeAppliesTo) {
                    case 1:
                        scope.transactionTypeOptions = scope.loanTransactionTypeOptions;
                        break ;
                    case 2:
                        scope.transactionTypeOptions = scope.savingsTransactionTypeoptions;
                        break ;
                }
            }

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                resourceFactory.transactionAuthenticationResource.save(this.formData, function (data) {
                    location.path('/viewtransactionauthentication');
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateTransactionAuthentication', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.CreateTransactionAuthentication]).run(function ($log) {
        $log.info("CreateTransactionAuthentication initialized");
    });
}(mifosX.controllers || {}));
