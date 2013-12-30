(function(module) {
  mifosX.controllers = _.extend(module, {
    AccFreqPostingController: function(scope, resourceFactory, location,dateFilter) {

            scope.formData = {};
            scope.formData.crAccounts = [];
            scope.formData.dbAccounts = [];
            scope.first = {};
            scope.allowCreditEntries = true;
            scope.allowDebitEntries = true;
            scope.errorcreditevent = false;
            scope.errordebitevent = false;
            scope.restrictDate = new Date();

            resourceFactory.accountingRulesResource.getAllRules({associations : 'all'}, function(data){
              scope.rules = data;
            });

            resourceFactory.currencyConfigResource.get({fields : 'selectedCurrencyOptions'}, function(data){
              scope.currencyOptions = data.selectedCurrencyOptions;
            });

            resourceFactory.officeResource.getAllOffices(function(data){
              scope.offices = data;
              scope.formData.officeId = scope.offices[0].id;  
            });

            //event for rule change
            scope.resetCrAndDb = function (rule) {
              scope.formData.crAccounts = [];
              scope.formData.dbAccounts = [];
              scope.formData.creditAccountTemplate = rule.creditAccounts[0];
              scope.formData.debitAccountTemplate = rule.debitAccounts[0];
              scope.allowCreditEntries = true;
              scope.allowDebitEntries = true;
            }

            //events for credits
            scope.addCrAccount = function () {
              if(scope.formData.crAmountTemplate != undefined){
                scope.errorcreditevent = false;
                scope.formData.crAccounts.push({crGlAccountId: scope.formData.creditAccountTemplate.id, crGlcode: scope.formData.creditAccountTemplate.glCode, crGlName : scope.formData.creditAccountTemplate.name , crAmount : scope.formData.crAmountTemplate});
                scope.formData.crAmountTemplate = undefined;
                if (scope.formData.rule) {
                  if (!scope.formData.rule.allowMultipleCreditEntries) {
                    scope.allowCreditEntries = false;
                  }
                }
              } else {
                scope.errorcreditevent = true;
              }
            }

            scope.removeCrAccount = function(index) {
              scope.formData.crAccounts.splice(index,1);
              if (scope.formData.crAccounts.length == 0) {
                scope.allowCreditEntries = true;
              }
            }

            //events for debits
            scope.addDebitAccount = function () {
              if(scope.formData.debitAmountTemplate != undefined){
                scope.errordebitevent = false;
                scope.formData.dbAccounts.push({debitGlAccountId: scope.formData.debitAccountTemplate.id, debitGlcode: scope.formData.debitAccountTemplate.glCode, debitGlName : scope.formData.debitAccountTemplate.name , debitAmount : scope.formData.debitAmountTemplate});
                scope.formData.debitAmountTemplate = undefined;
                if (scope.formData.rule) {
                  if (!scope.formData.rule.allowMultipleDebitEntries) {
                    scope.allowDebitEntries = false;
                  }
                }
              } else {
                scope.errordebitevent = true;
              }
            }

            scope.removeDebitAccount = function(index) {
              scope.formData.dbAccounts.splice(index,1);
              if (scope.formData.dbAccounts.length == 0) {
                scope.allowDebitEntries = true;
              }
            }

            scope.submit = function() {
                  var jeTransaction = new Object();
                  var reqDate = dateFilter(scope.first.date,scope.df);
                  jeTransaction.locale = scope.optlang.code;
                  jeTransaction.dateFormat = scope.df;
                  jeTransaction.officeId=this.formData.officeId;
                  jeTransaction.transactionDate = reqDate;
                  jeTransaction.referenceNumber = this.formData.referenceNumber;
                  jeTransaction.comments = this.formData.comments;
                  if ( this.formData.rule) {
                    jeTransaction.accountingRule = this.formData.rule.id;
                  }
                  jeTransaction.currencyCode = this.formData.currencyCode;

                  //Construct credits array
                  jeTransaction.credits = [];
                  for (var i = 0; i < this.formData.crAccounts.length; i++) {
                    var temp = new Object();
                    temp.glAccountId = this.formData.crAccounts[i].crGlAccountId;
                    temp.amount = this.formData.crAccounts[i].crAmount;
                    jeTransaction.credits.push(temp);
                  }

                  //construct debits array
                  jeTransaction.debits = [];
                  for (var i = 0; i < this.formData.dbAccounts.length; i++) {
                    var temp = new Object();
                    temp.glAccountId = this.formData.dbAccounts[i].debitGlAccountId;
                    temp.amount = this.formData.dbAccounts[i].debitAmount;
                    jeTransaction.debits.push(temp);
                  }

                  resourceFactory.journalEntriesResource.save(jeTransaction,function(data){
                    location.path('/viewtransactions/'+data.transactionId);
                  });
            }
    }
  });
  mifosX.ng.application.controller('AccFreqPostingController', ['$scope', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.AccFreqPostingController]).run(function($log) {
    $log.info("AccFreqPostingController initialized");
  });
}(mifosX.controllers || {}));
