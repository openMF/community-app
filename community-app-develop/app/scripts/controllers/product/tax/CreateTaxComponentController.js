(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateTaxComponentController: function (scope, resourceFactory, location, dateFilter) {
            scope.debitaccounts = [];
            scope.creditaccounts = [];
            scope.start = {};
            scope.start.date = new Date();
            scope.restrictDate = new Date('2025-06-22');
            scope.formData = {};
            scope.tempAccounts = [];
            resourceFactory.taxcomponenttemplate.get(function (data) {
                scope.data = data;
                scope.accounts = data.glAccountOptions;
            });

            scope.populateDebitAccount = function(){
                scope.populateAccounts(scope.formData.debitAccountType);
                scope.debitaccounts = scope.tempAccounts;
                scope.debitAcountId = null;
            };

            scope.populateCreditAccount = function(){
                scope.populateAccounts(scope.formData.creditAccountType);
                scope.creditaccounts = scope.tempAccounts;
                scope.creditAcountId = null;
            };

            scope.populateAccounts = function(selectedOption){

                switch(selectedOption) {
                    case 1:
                        scope.tempAccounts = scope.accounts.assetAccountOptions;
                        break;
                    case 2:
                        scope.tempAccounts = scope.accounts.liabilityAccountOptions;
                        break;
                    case 3:
                        scope.tempAccounts = scope.accounts.equityAccountOptions;
                        break;
                    case 4:
                        scope.tempAccounts = scope.accounts.incomeAccountOptions;
                        break;
                    case 5:
                        scope.tempAccounts = scope.accounts.expenseAccountOptions;
                        break;
                    default:
                    break;
                }
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                var reqDate = dateFilter(scope.start.date, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.startDate = reqDate;
                resourceFactory.taxcomponent.save(this.formData, function (data) {
                    location.path('/viewtaxcomponent/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateTaxComponentController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateTaxComponentController]).run(function ($log) {
        $log.info("CreateTaxComponentController initialized");
    });
}(mifosX.controllers || {}));
