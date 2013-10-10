(function(module) {
  mifosX.controllers = _.extend(module, {
    EditSavingProductController: function(scope, resourceFactory, location, routeParams) {
        scope.formData = {};
        scope.charges = [];
        scope.showOrHideValue = "show";
        scope.configureFundOptions = [];
        scope.specificIncomeaccounts = [];
        scope.penaltySpecificIncomeaccounts = [];
        scope.configureFundOption = {};

        resourceFactory.savingProductResource.get({savingProductId :routeParams.id, template:'true'}, function(data) {
            scope.product = data;
            scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions;
            scope.liabilityAccountOptions = scope.product.accountingMappingOptions.liabilityAccountOptions;
            scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions;
            scope.expenseAccountOptions = scope.product.accountingMappingOptions.expenseAccountOptions;
            scope.formData = {
              name : data.name,
              description : data.description,
              currencyCode : data.currency.code,
              digitsAfterDecimal : data.currency.decimalPlaces,
              inMultiplesOf : data.currency.inMultiplesOf,
              nominalAnnualInterestRate : data.nominalAnnualInterestRate,
              minRequiredOpeningBalance : data.minRequiredOpeningBalance,
              lockinPeriodFrequency : data.lockinPeriodFrequency,
              lockinPeriodFrequencyType : data.lockinPeriodFrequencyType.id,
              withdrawalFeeForTransfers : data.withdrawalFeeForTransfers == true ? 'true' : 'false',
              interestCompoundingPeriodType : data.interestCompoundingPeriodType.id,
              interestPostingPeriodType : data.interestPostingPeriodType.id,
              interestCalculationType : data.interestCalculationType.id,
              interestCalculationDaysInYearType : data.interestCalculationDaysInYearType.id,
              accountingRule : data.accountingRule.id,
            }

            if(scope.formData.accountingRule == 1){
              scope.formData.savingsReferenceAccountId = scope.assetAccountOptions[0].id;
              scope.formData.savingsControlAccountId = scope.liabilityAccountOptions[0].id;
              scope.formData.transfersInSuspenseAccountId = scope.liabilityAccountOptions[1].id;
              scope.formData.incomeFromFeeAccountId = scope.incomeAccountOptions[0].id;
              scope.formData.incomeFromPenaltyAccountId = scope.incomeAccountOptions[1].id;
              scope.formData.interestOnSavingsAccountId = scope.expenseAccountOptions[0].id;
            } else {
              scope.formData.savingsReferenceAccountId = data.accountingMappings.savingsReferenceAccountId;
              scope.formData.savingsControlAccountId = data.accountingMappings.savingsControlAccountId;
              scope.formData.transfersInSuspenseAccountId = data.accountingMappings.transfersInSuspenseAccountId;
              scope.formData.incomeFromFeeAccountId = data.accountingMappings.incomeFromFeeAccountId;
              scope.formData.incomeFromPenaltyAccountId = data.accountingMappings.incomeFromPenaltyAccountId;
              scope.formData.interestOnSavingsAccountId = data.accountingMappings.interestOnSavingsAccountId;

              _.each(scope.product.paymentChannelToFundSourceMappings, function(fundSource){  
                scope.configureFundOptions.push({
                  paymentTypeId : fundSource.paymentTypeId,
                  fundSourceAccountId : fundSource.fundSourceAccountId,
                  paymentTypeOptions : scope.product.paymentTypeOptions,
                  assetAccountOptions : scope.assetAccountOptions
                })
              });

              _.each(scope.product.feeToIncomeAccountMappings, function(fees){  
                scope.specificIncomeaccounts.push({
                  chargeId : fees.chargeId,
                  incomeAccountId : fees.incomeAccountId,
                  chargeOptions : scope.product.chargeOptions,
                  incomeAccountOptions : scope.incomeAccountOptions
                })
              });

              _.each(scope.product.penaltyToIncomeAccountMappings, function(penalty){  
                scope.penaltySpecificIncomeaccounts.push({
                  chargeId : fees.chargeId,
                  incomeAccountId : fees.incomeAccountId,
                  chargeOptions : scope.product.chargeOptions,
                  incomeAccountOptions : scope.incomeAccountOptions
                })
              });
            }
            
        });

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
          this.formData.locale = "en";

          resourceFactory.savingProductResource.update({savingProductId : routeParams.id}, this.formData,function(data){
            location.path('/viewsavingproduct/' + data.resourceId);
          });
        }
    }
  });
  mifosX.ng.application.controller('EditSavingProductController', ['$scope', 'ResourceFactory', '$location','$routeParams', mifosX.controllers.EditSavingProductController]).run(function($log) {
    $log.info("EditSavingProductController initialized");
  });
}(mifosX.controllers || {}));
