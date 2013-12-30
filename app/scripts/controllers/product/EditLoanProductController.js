(function(module) {
  mifosX.controllers = _.extend(module, {
    EditLoanProductController: function(scope, resourceFactory, location, routeParams,dateFilter) {
        scope.formData = {};
        scope.charges = [];
        scope.showOrHideValue = "show";
        scope.configureFundOptions = [];
        scope.specificIncomeaccounts = [];
        scope.penaltySpecificIncomeaccounts = [];
        scope.configureFundOption = {};
        scope.date = {};
        scope.irFlag = false;
        scope.pvFlag = false;
        scope.rvFlag = false;

        resourceFactory.loanProductResource.get({loanProductId : routeParams.id, template:'true'}, function(data) {
            scope.product = data;
            scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions || [];
            scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions || [];
            scope.expenseAccountOptions = scope.product.accountingMappingOptions.expenseAccountOptions || [];
            scope.liabilityOptions = data.accountingMappingOptions.liabilityAccountOptions || [];
            scope.charges = scope.product.charges || [];
            if(data.startDate){scope.date.first = new Date(data.startDate);}
            if(data.closeDate){scope.date.second = new Date(data.closeDate);}
            scope.formData = {
              name : scope.product.name,
              shortName : scope.product.shortName,
              description : scope.product.description,
              fundId : scope.product.fundId,
              description : scope.product.description,
              includeInBorrowerCycle : scope.product.includeInBorrowerCycle,
              useBorrowerCycle : scope.product.useBorrowerCycle,
              currencyCode : scope.product.currency.code,
              digitsAfterDecimal : scope.product.currency.decimalPlaces,
              inMultiplesOf : scope.product.currency.inMultiplesOf,
              principal : scope.product.principal,
              minPrincipal : scope.product.minPrincipal,
              maxPrincipal : scope.product.maxPrincipal,
              numberOfRepayments : scope.product.numberOfRepayments,
              minNumberOfRepayments : scope.product.minNumberOfRepayments,
              maxNumberOfRepayments : scope.product.maxNumberOfRepayments,
              repaymentEvery : scope.product.repaymentEvery,
              repaymentFrequencyType : scope.product.repaymentFrequencyType.id,
              interestRatePerPeriod : scope.product.interestRatePerPeriod,
              minInterestRatePerPeriod : scope.product.minInterestRatePerPeriod,
              maxInterestRatePerPeriod : scope.product.maxInterestRatePerPeriod,
              interestRateFrequencyType : scope.product.interestRateFrequencyType.id,
              amortizationType : scope.product.amortizationType.id,
              interestType : scope.product.interestType.id,
              interestCalculationPeriodType : scope.product.interestCalculationPeriodType.id,
              inArrearsTolerance : scope.product.inArrearsTolerance,
              transactionProcessingStrategyId : scope.product.transactionProcessingStrategyId,
              graceOnPrincipalPayment : scope.product.graceOnPrincipalPayment,
              graceOnInterestPayment : scope.product.graceOnInterestPayment,
              graceOnInterestCharged : scope.product.graceOnInterestCharged,
              accountingRule : scope.product.accountingRule.id,
              principalVariationsForBorrowerCycle : [],
              interestRateVariationsForBorrowerCycle : [],
              numberOfRepaymentVariationsForBorrowerCycle : []
            }

            _.each(scope.product.principalVariationsForBorrowerCycle, function(variation){  
                scope.formData.principalVariationsForBorrowerCycle.push({
                  id : variation.id,
                  borrowerCycleNumber : variation.borrowerCycleNumber,
                  valueConditionType : variation.valueConditionType.id,
                  minValue : variation.minValue,
                  maxValue : variation.maxValue,
                  defaultValue : variation.defaultValue
                })
              });

            _.each(scope.product.interestRateVariationsForBorrowerCycle, function(variation){  
                scope.formData.interestRateVariationsForBorrowerCycle.push({
                  id : variation.id,
                  borrowerCycleNumber : variation.borrowerCycleNumber,
                  valueConditionType : variation.valueConditionType.id,
                  minValue : variation.minValue,
                  maxValue : variation.maxValue,
                  defaultValue : variation.defaultValue
                })
              });

            _.each(scope.product.numberOfRepaymentVariationsForBorrowerCycle, function(variation){  
                scope.formData.numberOfRepaymentVariationsForBorrowerCycle.push({
                  id : variation.id,
                  borrowerCycleNumber : variation.borrowerCycleNumber,
                  valueConditionType : variation.valueConditionType.id,
                  minValue : variation.minValue,
                  maxValue : variation.maxValue,
                  defaultValue : variation.defaultValue
                })
              });


            if(scope.formData.accountingRule == 1){
              if (scope.assetAccountOptions.length > 0) {
                scope.formData.fundSourceAccountId = scope.assetAccountOptions[0].id;
              }
              if (scope.assetAccountOptions.length > 1) {
                scope.formData.loanPortfolioAccountId = scope.assetAccountOptions[1].id;
              }
              if (scope.assetAccountOptions.length > 2) {
                scope.formData.transfersInSuspenseAccountId = scope.assetAccountOptions[2].id;
              }
              if (scope.incomeAccountOptions.length > 0) {
                scope.formData.interestOnLoanAccountId = scope.incomeAccountOptions[0].id;
              }
              if (scope.incomeAccountOptions.length > 1) {
                scope.formData.incomeFromFeeAccountId = scope.incomeAccountOptions[1].id;
              }
              if (scope.incomeAccountOptions.length > 2) {
                scope.formData.incomeFromPenaltyAccountId = scope.incomeAccountOptions[2].id;
              }
              if (scope.expenseAccountOptions.length > 0) {
                scope.formData.writeOffAccountId = scope.expenseAccountOptions[0].id;
              }
              if (scope.liabilityOptions.length > 0) {
                scope.formData.overpaymentLiabilityAccountId = scope.liabilityOptions[0].id;
              }
            } else {
              scope.formData.fundSourceAccountId = scope.product.accountingMappings.fundSourceAccount.id;
              scope.formData.loanPortfolioAccountId = scope.product.accountingMappings.loanPortfolioAccount.id;
              scope.formData.transfersInSuspenseAccountId = scope.product.accountingMappings.transfersInSuspenseAccount.id;
              scope.formData.interestOnLoanAccountId = scope.product.accountingMappings.interestOnLoanAccount.id;
              scope.formData.incomeFromFeeAccountId = scope.product.accountingMappings.incomeFromFeeAccount.id;
              scope.formData.incomeFromPenaltyAccountId = scope.product.accountingMappings.incomeFromPenaltyAccount.id;
              scope.formData.writeOffAccountId = scope.product.accountingMappings.writeOffAccount.id;
              scope.formData.overpaymentLiabilityAccountId = scope.product.accountingMappings.overpaymentLiabilityAccount.id;

              _.each(scope.product.paymentChannelToFundSourceMappings, function(fundSource){  
                scope.configureFundOptions.push({
                  paymentTypeId : fundSource.paymentType.id,
                  fundSourceAccountId : fundSource.fundSourceAccount.id,
                  paymentTypeOptions : scope.product.paymentTypeOptions,
                  assetAccountOptions : scope.assetAccountOptions
                })
              });

              _.each(scope.product.feeToIncomeAccountMappings, function(fees){  
                scope.specificIncomeaccounts.push({
                  chargeId : fees.charge.id,
                  incomeAccountId : fees.incomeAccount.id,
                  chargeOptions : scope.product.chargeOptions,
                  incomeAccountOptions : scope.incomeAccountOptions
                })
              });

              _.each(scope.product.penaltyToIncomeAccountMappings, function(penalty){  
                scope.penaltySpecificIncomeaccounts.push({
                  chargeId : penalty.charge.id,
                  incomeAccountId : penalty.incomeAccount.id,
                  penaltyOptions : scope.product.penaltyOptions,
                  incomeAccountOptions : scope.incomeAccountOptions
                })
              });
            }
            
        });

        scope.chargeSelected = function(chargeId) {
          resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, this.formData,function(data){
              data.chargeId = data.id;
              scope.charges.push(data);
              //to charge select box empty
              scope.chargeId = '';
          });
        };

        scope.deleteCharge = function(index) {
            scope.charges.splice(index,1);
        };

        //advanced accounting rule
        scope.showOrHide = function(showOrHideValue) {
          if(showOrHideValue == "show") {
            scope.showOrHideValue = 'hide';
          }

          if(showOrHideValue == "hide") {
            scope.showOrHideValue = 'show';
          }
        };

        scope.addConfigureFundSource = function() {
          if (scope.product.paymentTypeOptions && scope.product.paymentTypeOptions.length > 0 && 
            scope.assetAccountOptions && scope.assetAccountOptions.length > 0) {
              scope.configureFundOptions.push({
                paymentTypeId : scope.product.paymentTypeOptions[0].id,
                fundSourceAccountId : scope.assetAccountOptions[0].id,
                paymentTypeOptions : scope.product.paymentTypeOptions,
                assetAccountOptions : scope.assetAccountOptions
              });
          }
        };

        scope.mapFees = function() {
          if (scope.product.chargeOptions && scope.product.chargeOptions.length > 0 && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
            scope.specificIncomeaccounts.push({
              chargeId : scope.product.chargeOptions[0].id,
              incomeAccountId : scope.incomeAccountOptions[0].id,
              chargeOptions : scope.product.chargeOptions,
              incomeAccountOptions : scope.product.accountingMappingOptions.incomeAccountOptions
            });
          }
        };

        scope.mapPenalty = function() {
          if (scope.product.penaltyOptions && scope.product.penaltyOptions.length > 0 && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
            scope.penaltySpecificIncomeaccounts.push({
              chargeId : scope.product.penaltyOptions[0].id,
              incomeAccountId : scope.incomeAccountOptions[0].id,
              penaltyOptions : scope.product.penaltyOptions,
              incomeAccountOptions : scope.incomeAccountOptions
            });
          }
        };

        scope.addPrincipalVariation = function() {
            scope.pvFlag=true;
          scope.formData.principalVariationsForBorrowerCycle.push({
            valueConditionType : scope.product.valueConditionTypeOptions[0].id
          })
        };
        scope.addInterestRateVariation = function() {
            scope.irFlag = true;
          scope.formData.interestRateVariationsForBorrowerCycle.push({
            valueConditionType : scope.product.valueConditionTypeOptions[0].id
          })
        };
        scope.addNumberOfRepaymentVariation = function() {
            scope.rvFlag = true;
          scope.formData.numberOfRepaymentVariationsForBorrowerCycle.push({
            valueConditionType : scope.product.valueConditionTypeOptions[0].id
          })
        };


        scope.deleteFund = function(index) {
          scope.configureFundOptions.splice(index,1);
        };

        scope.deleteFee = function(index) {
          scope.specificIncomeaccounts.splice(index,1);
        };

        scope.deletePenalty = function(index) {
          scope.penaltySpecificIncomeaccounts.splice(index,1);
        };

        scope.deletePrincipalVariation = function(index) {
            scope.formData.principalVariationsForBorrowerCycle.splice(index,1);
        };

        scope.deleteInterestRateVariation = function(index) {
            scope.formData.interestRateVariationsForBorrowerCycle.splice(index,1);
        };

        scope.deleterepaymentVariation = function(index) {
            scope.formData.numberOfRepaymentVariationsForBorrowerCycle.splice(index,1);
        };
        scope.setFlag = function(){
            if(scope.formData.principalVariationsForBorrowerCycle){
                  scope.pvFlag = true;
            }
            if(scope.formData.numberOfRepaymentVariationsForBorrowerCycle){
                 scope.rvFlag = true;
            }
            if(scope.formData.interestRateVariationsForBorrowerCycle){
                scope.irFlag = true;
            }
        };
        scope.setFlag();
        scope.submit = function() {
          scope.paymentChannelToFundSourceMappings = [];
          scope.feeToIncomeAccountMappings = [];
          scope.penaltyToIncomeAccountMappings = [];
          scope.chargesSelected = [];
          var reqFirstDate = dateFilter(scope.date.first,scope.df);
          var reqSecondDate = dateFilter(scope.date.second,scope.df);
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
            scope.penaltyToIncomeAccountMappings.push(temp);
          }

          for (var i in scope.charges) {
            temp = {
              id : scope.charges[i].id
            }
            scope.chargesSelected.push(temp);
          }

          this.formData.paymentChannelToFundSourceMappings = scope.paymentChannelToFundSourceMappings;
          this.formData.feeToIncomeAccountMappings = scope.feeToIncomeAccountMappings;
          this.formData.penaltyToIncomeAccountMappings = scope.penaltyToIncomeAccountMappings;
          this.formData.charges = scope.chargesSelected;
          this.formData.dateFormat = "dd MMMM yyyy";
          this.formData.locale = "en";
          this.formData.startDate = reqFirstDate;
          this.formData.closeDate = reqSecondDate;
          resourceFactory.loanProductResource.put({loanProductId : routeParams.id}, this.formData,function(data){
            location.path('/viewloanproduct/' + data.resourceId);
          });
        }
    }
  });
  mifosX.ng.application.controller('EditLoanProductController', ['$scope', 'ResourceFactory', '$location', '$routeParams','dateFilter', mifosX.controllers.EditLoanProductController]).run(function($log) {
    $log.info("EditLoanProductController initialized");
  });
}(mifosX.controllers || {}));
