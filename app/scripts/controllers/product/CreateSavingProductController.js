(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateSavingProductController: function(scope, resourceFactory, location) {
        scope.formData = {};
        scope.charges = [];
        scope.showOrHideValue = "show";
        scope.configureFundOptions = [];
        scope.specificIncomeaccounts = [];
        scope.penaltySpecificIncomeaccounts = [];
        scope.configureFundOption = {};

        resourceFactory.savingProductResource.get({resourceType:'template'}, function(data) {
            scope.product = data;
            scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions;
            scope.liabilityAccountOptions = scope.product.accountingMappingOptions.liabilityAccountOptions;
            scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions;
            scope.expenseAccountOptions = scope.product.accountingMappingOptions.expenseAccountOptions;

            scope.formData = {
              currencyCode : data.currencyOptions[0].code,
              digitsAfterDecimal : data.currencyOptions[0].decimalPlaces,
              interestCompoundingPeriodType : data.interestCompoundingPeriodType.id,
              interestPostingPeriodType : data.interestPostingPeriodType.id,
              interestCalculationType : data.interestCalculationType.id,
              interestCalculationDaysInYearType : data.interestCalculationDaysInYearType.id,
              savingsReferenceAccountId : scope.assetAccountOptions[0].id,
              savingsControlAccountId : scope.liabilityAccountOptions[0].id,
              transfersInSuspenseAccountId : scope.liabilityAccountOptions[1].id,
              incomeFromFeeAccountId : scope.incomeAccountOptions[0].id,
              incomeFromPenaltyAccountId : scope.incomeAccountOptions[1].id,
              interestOnSavingsAccountId : scope.expenseAccountOptions[0].id,
              accountingRule : '1',
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

          resourceFactory.savingProductResource.save(this.formData,function(data){
            location.path('/viewsavingproduct/' + data.resourceId);
          });
        }
    }
  });
  mifosX.ng.application.controller('CreateSavingProductController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateSavingProductController]).run(function($log) {
    $log.info("CreateSavingProductController initialized");
  });
}(mifosX.controllers || {}));
