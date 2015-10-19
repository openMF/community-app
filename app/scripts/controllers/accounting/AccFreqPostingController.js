(function (module) {
    mifosX.controllers = _.extend(module, {
        AccFreqPostingController: function (scope, resourceFactory, location, dateFilter) {

            scope.formData = {};
            scope.formData.crAccounts = [];
            scope.formData.dbAccounts = [];
            scope.first = {};
            scope.allowCreditEntries = true;
            scope.allowDebitEntries = true;
            scope.errorcreditevent = false;
            scope.errordebitevent = false;
            scope.restrictDate = new Date();
            scope.showPaymentDetails = false;

            resourceFactory.accountingRulesResource.getAllRules({associations: 'all'}, function (data) {
                scope.rules = data;
            });

            resourceFactory.paymentTypeResource.getAll( function (data) {
                scope.paymentTypes = data;
            });
            resourceFactory.currencyConfigResource.get({fields: 'selectedCurrencyOptions'}, function (data) {
                scope.currencyOptions = data.selectedCurrencyOptions;
                scope.formData.currencyCode = scope.currencyOptions[0].code;
            });

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData.officeId = scope.offices[0].id;
            });

            //event for rule change
            scope.resetCrAndDb = function (rule) {
            	  scope.rule = rule;
                scope.formData.crAccounts = [{}];
                scope.formData.dbAccounts = [{}];
                
                if(rule.allowMultipleDebitEntries) {
                  scope.allowDebitEntries = true;
                }else{
                  scope.allowDebitEntries = false;
                }
                if(rule.allowMultipleCreditEntries) {
                  scope.allowCreditEntries = true;
                }else{
                  scope.allowCreditEntries = false;
                }
            }
            
            //events for credits
            scope.addCrAccount = function () {
                scope.errorcreditevent = false;
                scope.formData.crAccounts.push({});
                scope.formData.crAmountTemplate = undefined;
                if (scope.formData.rule) {
                    if (!scope.formData.rule.allowMultipleCreditEntries) {
                        scope.allowCreditEntries = false;
                    }
                }
            }

            scope.removeCrAccount = function (index) {
                scope.formData.crAccounts.splice(index, 1);
                if (scope.formData.crAccounts.length == 0) {
                    scope.allowCreditEntries = true;
                }
            }

            //events for debits
            scope.addDebitAccount = function () {
                scope.errordebitevent = false;
                scope.formData.dbAccounts.push({});
                scope.formData.debitAmountTemplate = undefined;
                if (scope.formData.rule) {
                    if (!scope.formData.rule.allowMultipleDebitEntries) {
                        scope.allowDebitEntries = false;
                    }
                }
            }

            scope.removeDebitAccount = function (index) {
                scope.formData.dbAccounts.splice(index, 1);
                if (scope.formData.dbAccounts.length == 0) {
                    scope.allowDebitEntries = true;
                }
            }

            scope.submit = function () {
                var jeTransaction = new Object();
                var reqDate = dateFilter(scope.first.date, scope.df);
                jeTransaction.locale = scope.optlang.code;
                jeTransaction.dateFormat = scope.df;
                jeTransaction.officeId = this.formData.officeId;
                jeTransaction.transactionDate = reqDate;
                jeTransaction.referenceNumber = this.formData.referenceNumber;
                jeTransaction.comments = this.formData.comments;
                if (this.formData.rule) {
                    jeTransaction.accountingRule = this.formData.rule.id;
                }
                jeTransaction.currencyCode = this.formData.currencyCode;
                jeTransaction.paymentTypeId = this.formData.paymentTypeId;
                jeTransaction.accountNumber = this.formData.accountNumber;
                jeTransaction.checkNumber = this.formData.checkNumber;
                jeTransaction.routingCode = this.formData.routingCode;
                jeTransaction.receiptNumber = this.formData.receiptNumber;
                jeTransaction.bankNumber = this.formData.bankNumber;

                //Construct credits array
                jeTransaction.credits = [];
                for (var i = 0; i < this.formData.crAccounts.length; i++) {
                    var temp = new Object();
                    temp.glAccountId = this.formData.crAccounts[i].select.id;
                    temp.amount = this.formData.crAccounts[i].crAmount;
                    jeTransaction.credits.push(temp);
                }

                //construct debits array
                jeTransaction.debits = [];
                for (var i = 0; i < this.formData.dbAccounts.length; i++) {
                    var temp = new Object();
                    temp.glAccountId = this.formData.dbAccounts[i].select.id;
                    temp.amount = this.formData.dbAccounts[i].debitAmount;
                    jeTransaction.debits.push(temp);
                }

                resourceFactory.journalEntriesResource.save(jeTransaction, function (data) {
                    location.path('/viewtransactions/' + data.transactionId);
                });
            }
        }
    });
    mifosX.ng.application.controller('AccFreqPostingController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.AccFreqPostingController]).run(function ($log) {
        $log.info("AccFreqPostingController initialized");
    });
}(mifosX.controllers || {}));
