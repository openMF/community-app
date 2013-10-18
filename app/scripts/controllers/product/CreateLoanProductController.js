(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateLoanProductController: function(scope, resourceFactory, location,dateFilter) {
        scope.formData = {};
        scope.charges = [];
        scope.showOrHideValue = "show";
        scope.configureFundOptions = [];
        scope.specificIncomeaccounts = [];
        scope.penaltySpecificIncomeaccounts = [];
        scope.configureFundOption = {};
        scope.date = {};
        resourceFactory.loanProductResource.get({resourceType:'template'}, function(data) {
            scope.product = data;
            scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions;
            scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions;
            scope.expenseAccountOptions = scope.product.accountingMappingOptions.expenseAccountOptions;
            scope.liabilityOptions = data.accountingMappingOptions.liabilityAccountOptions;

            scope.formData = {
              currencyCode : scope.product.currencyOptions[0].code,
              includeInBorrowerCycle : 'false',
              digitsAfterDecimal : '2',
              inMultiplesOf : '0',
              repaymentFrequencyType : scope.product.repaymentFrequencyType.id,
              interestRateFrequencyType : scope.product.interestRateFrequencyType.id,
              amortizationType : scope.product.amortizationType.id,
              interestType : scope.product.interestType.id,
              interestCalculationPeriodType : scope.product.interestCalculationPeriodType.id,
              transactionProcessingStrategyId : scope.product.transactionProcessingStrategyOptions[0].id,
              fundSourceAccountId : scope.assetAccountOptions[0].id,
              loanPortfolioAccountId : scope.assetAccountOptions[1].id,
              transfersInSuspenseAccountId : scope.assetAccountOptions[2].id,
              interestOnLoanAccountId : scope.incomeAccountOptions[0].id,
              incomeFromFeeAccountId : scope.incomeAccountOptions[1].id,
              incomeFromPenaltyAccountId : scope.incomeAccountOptions[2].id,
              writeOffAccountId : scope.expenseAccountOptions[0].id,
              accountingRule : '1',
              overpaymentLiabilityAccountId : scope.liabilityOptions[0].id
            }
            
        });

        scope.chargeSelected = function(chargeId) {
          resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, this.formData,function(data){
              data.chargeId = data.id;
              scope.charges.push(data);
              //to charge select box empty
              scope.chargeId = '';
          });
        }

        scope.deleteCharge = function(index) {
            scope.charges.splice(index,1);
        }

        //advanced accounting rule
        scope.showOrHide = function(showOrHideValue) {
          
          if(showOrHideValue == "show")
          {
            scope.showOrHideValue = 'hide';
          }

          if(showOrHideValue == "hide")
          {
            scope.showOrHideValue = 'show';
          }
        }


        scope.addConfigureFundSource = function() {
          scope.configureFundOptions.push({
            paymentTypeId : scope.product.paymentTypeOptions[0].id,
            fundSourceAccountId : scope.assetAccountOptions[0].id,
            paymentTypeOptions : scope.product.paymentTypeOptions,
            assetAccountOptions : scope.assetAccountOptions
          })
        }

        scope.mapFees = function() {
          scope.specificIncomeaccounts.push({
            chargeId : scope.product.chargeOptions[0].id,
            incomeAccountId : scope.incomeAccountOptions[0].id,
            chargeOptions : scope.product.chargeOptions,
            incomeAccountOptions : scope.product.accountingMappingOptions.incomeAccountOptions
          })
        }

        scope.mapPenalty = function() {
          scope.penaltySpecificIncomeaccounts.push({
            chargeId : scope.product.chargeOptions[0].id,
            incomeAccountId : scope.incomeAccountOptions[0].id,
            chargeOptions : scope.product.chargeOptions,
            incomeAccountOptions : scope.incomeAccountOptions
          })
        }

        scope.deleteFund = function(index) {
            scope.configureFundOptions.splice(index,1);
        } 

        scope.deleteFee = function(index) {
            scope.specificIncomeaccounts.splice(index,1);
        }

        scope.deletePenalty = function(index) {
            scope.penaltySpecificIncomeaccounts.splice(index,1);
        } 

        scope.submit = function() {
          var reqFirstDate = dateFilter(scope.date.first,'dd MMMM yyyy');
          var reqSecondDate = dateFilter(scope.date.second,'dd MMMM yyyy');
          scope.paymentChannelToFundSourceMappings = [];
          scope.feeToIncomeAccountMappings = [];
          scope.penaltyToIncomeAccountMappings = [];
          scope.chargesSelected = [];

          var temp = '';

          //configure fund sources for payment channels 
          for (var i in scope.configureFundOptions) {
            temp = {
              paymentTypeId : scope.configureFundOptions[i].paymentTypeId,
              fundSourceAccountId : scope.configureFundOptions[i].fundSourceAccountId
            }
            scope.paymentChannelToFundSourceMappings.push(temp);
          }

          //map fees to specific income accounts
          for (var i in scope.specificIncomeaccounts) {
            temp = {
              chargeId : scope.specificIncomeaccounts[i].chargeId,
              incomeAccountId : scope.specificIncomeaccounts[i].incomeAccountId,
            }
            scope.feeToIncomeAccountMappings.push(temp);
          }

          //map penalties to specific income accounts 
          for (var i in scope.penaltySpecificIncomeaccounts) {
            temp = {
              chargeId : scope.penaltySpecificIncomeaccounts[i].chargeId,
              incomeAccountId : scope.penaltySpecificIncomeaccounts[i].incomeAccountId,
            }
            scope.penaltySpecificIncomeaccounts.push(temp);
          }

          for (var i in scope.charges) {
            temp = {
              id : scope.charges[i].id
            }
            scope.chargesSelected.push(temp);
          }

          this.formData.paymentChannelToFundSourceMappings = scope.paymentChannelToFundSourceMappings;
          this.formData.feeToIncomeAccountMappings = scope.feeToIncomeAccountMappings;
          this.formData.penaltyToIncomeAccountMappings = scope.penaltySpecificIncomeaccounts;
          this.formData.charges = scope.chargesSelected;
          this.formData.dateFormat = "dd MMMM yyyy";
          this.formData.locale = "en";
          this.formData.startDate = reqFirstDate;
          this.formData.closeDate = reqSecondDate;
          resourceFactory.loanProductResource.save(this.formData,function(data){
            location.path('/viewloanproduct/' + data.resourceId);
          });
        }
    }
  });
  mifosX.ng.application.controller('CreateLoanProductController', ['$scope', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.CreateLoanProductController]).run(function($log) {
    $log.info("CreateLoanProductController initialized");
  });
}(mifosX.controllers || {}));
