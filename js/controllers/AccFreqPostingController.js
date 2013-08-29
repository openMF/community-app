(function(module) {
  mifosX.controllers = _.extend(module, {
    AccFreqPostingController: function(scope, resourceFactory, location) {

            scope.formData = {};
            scope.formData.crAccounts = [];
            scope.formData.dbAccounts = [];

            resourceFactory.accountingRulesResource.getAllRules({associations : 'all'}, function(data){
              scope.rules = data;
            });

            resourceFactory.officeResource.getAllOffices(function(data){
              scope.offices = data;  
            });

            //event for rule change
            scope.resetCrAndDb = function () {
              scope.formData.crAccounts = [];
              scope.formData.dbAccounts = [];
            }

            //events for credits
            scope.addCrAccount = function () {
              if(scope.formData.crAmountTemplate != undefined){
                scope.formData.crAccounts.push({crGlAccountId: scope.formData.creditAccountTemplate.id, crGlcode: scope.formData.creditAccountTemplate.glCode, crGlName : scope.formData.creditAccountTemplate.name , crAmount : scope.formData.crAmountTemplate});
                scope.formData.crAmountTemplate = undefined;
              }
            }

            scope.removeCrAccount = function(index) {
              scope.formData.crAccounts.splice(index,1);
            }

            //events for debits
            scope.addDebitAccount = function () {
              if(scope.formData.debitAmountTemplate != undefined){
                scope.formData.dbAccounts.push({debitGlAccountId: scope.formData.debitAccountTemplate.id, debitGlcode: scope.formData.debitAccountTemplate.glCode, debitGlName : scope.formData.debitAccountTemplate.name , debitAmount : scope.formData.debitAmountTemplate});
                scope.formData.debitAmountTemplate = undefined;
              }
            }

            scope.removeDebitAccount = function(index) {
              scope.formData.dbAccounts.splice(index,1);
            }

            scope.submit = function() {
                  var jeTransaction = new Object();
                  jeTransaction.locale = 'en';
                  jeTransaction.dateFormat = 'dd MMMM yyyy';
                  jeTransaction.officeId=this.formData.officeId;
                  jeTransaction.transactionDate = this.formData.transactionDate;
                  jeTransaction.referenceNumber = this.formData.referenceNumber;
                  jeTransaction.comments = this.formData.comments;
                  jeTransaction.accountingRule = this.formData.rule.id;

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
                    location.path('/accounting');
                  });
            }
    }
  });
  mifosX.ng.application.controller('AccFreqPostingController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AccFreqPostingController]).run(function($log) {
    $log.info("AccFreqPostingController initialized");
  });
}(mifosX.controllers || {}));
