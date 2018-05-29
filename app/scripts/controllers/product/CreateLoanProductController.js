(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateLoanProductController: function (scope, $rootScope, resourceFactory, location, dateFilter,WizardHandler) {
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.loanproduct = {};
            scope.charges = [];
            scope.accountingOptions = ['None','Cash','Accrual(Periodic)','Accrual(Upfront)'];
            scope.floatingrateoptions = [];
            scope.loanProductConfigurableAttributes = [];
            scope.showOrHideValue = "show";
            scope.configureFundOptions = [];
            scope.specificIncomeAccountMapping = [];
            scope.penaltySpecificIncomeaccounts = [];
            scope.configureFundOption = {};
            scope.date = {};
            scope.pvFlag = false;
            scope.rvFlag = false;
            scope.irFlag = false;
            scope.chargeFlag = false;
            scope.penalityFlag = false;
            scope.frFlag = false;
            scope.fiFlag = false;
            scope.piFlag = false;
            scope.amortization = true;
            scope.arrearsTolerance = true;
            scope.graceOnArrearsAging = true;
            scope.interestCalcPeriod = true;
            scope.interestMethod = true;
            scope.graceOnPrincipalAndInterest = true;
            scope.repaymentFrequency = true;
            scope.transactionProcessingStrategy = true;
            scope.allowAttributeConfiguration = true;
            scope.interestRecalculationOnDayTypeOptions = [];
            for (var i = 1; i <= 28; i++) {
                scope.interestRecalculationOnDayTypeOptions.push(i);
            }
            resourceFactory.loanProductResource.get({resourceType: 'template'}, function (data) {
                scope.product = data;
                scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions || [];
                scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions || [];
                scope.expenseAccountOptions = scope.product.accountingMappingOptions.expenseAccountOptions || [];
                scope.liabilityAccountOptions = scope.product.accountingMappingOptions.liabilityAccountOptions || [];
                scope.incomeAndLiabilityAccountOptions = scope.incomeAccountOptions.concat(scope.liabilityAccountOptions);
                scope.penaltyOptions = scope.product.penaltyOptions || [];
                scope.chargeOptions = scope.product.chargeOptions || [];
                scope.overduecharges = [];
                for (var i in scope.penaltyOptions) {
                    if (scope.penaltyOptions[i].chargeTimeType.code == 'chargeTimeType.overdueInstallment') {
                        scope.overduecharges.push(scope.penaltyOptions[i]);
                    }
                }
                scope.formData.currencyCode = scope.product.currencyOptions[0].code;
                scope.formData.includeInBorrowerCycle = 'false';
                scope.formData.useBorrowerCycle = false;
                scope.formData.digitsAfterDecimal = '2';
                scope.formData.inMultiplesOf = '0';
                scope.formData.repaymentFrequencyType = scope.product.repaymentFrequencyType.id;
                scope.formData.interestRateFrequencyType = scope.product.interestRateFrequencyType.id;
                scope.formData.amortizationType = scope.product.amortizationType.id;
                scope.formData.interestType = scope.product.interestType.id;
                scope.formData.interestCalculationPeriodType = scope.product.interestCalculationPeriodType.id;
                scope.formData.transactionProcessingStrategyId = scope.product.transactionProcessingStrategyOptions[0].id;
                scope.formData.principalVariationsForBorrowerCycle = scope.product.principalVariationsForBorrowerCycle;
                scope.formData.interestRateVariationsForBorrowerCycle = scope.product.interestRateVariationsForBorrowerCycle;
                scope.formData.numberOfRepaymentVariationsForBorrowerCycle = scope.product.numberOfRepaymentVariationsForBorrowerCycle;
                scope.formData.multiDisburseLoan = false;
                scope.formData.accountingRule = '1';
                scope.formData.daysInYearType = scope.product.daysInYearType.id;
                scope.formData.daysInMonthType = scope.product.daysInMonthType.id;
                scope.formData.isInterestRecalculationEnabled = scope.product.isInterestRecalculationEnabled;
                scope.formData.interestRecalculationCompoundingMethod = scope.product.interestRecalculationData.interestRecalculationCompoundingType.id;
                scope.formData.rescheduleStrategyMethod = scope.product.interestRecalculationData.rescheduleStrategyType.id;
                scope.formData.preClosureInterestCalculationStrategy = scope.product.interestRecalculationData.preClosureInterestCalculationStrategy.id;
                if(scope.product.interestRecalculationData.recalculationRestFrequencyType){
                    scope.formData.recalculationRestFrequencyType = scope.product.interestRecalculationData.recalculationRestFrequencyType.id;
                }
                scope.floatingRateOptions = data.floatingRateOptions ;
                scope.formData.isFloatingInterestRateCalculationAllowed = false ;
                scope.formData.isLinkedToFloatingInterestRates = false ;
                scope.formData.allowVariableInstallments = false ;
                scope.product.interestRecalculationNthDayTypeOptions.push({"code" : "onDay", "id" : -2, "value" : "on day"});
                scope.loanproduct = angular.copy(scope.formData);
                scope.isClicked = false;
            });

             scope.$watch('formData',function(newVal){
                scope.loanproduct = angular.extend(scope.loanproduct,newVal);
             },true);

             $rootScope.formValue = function(array,model,findattr,retAttr){
                 findattr = findattr ? findattr : 'id';
                 retAttr = retAttr ? retAttr : 'value';
                 console.log(findattr,retAttr,model);
                 return _.find(array, function (obj) {
                    return obj[findattr] === model;
                 })[retAttr];
            };

            scope.goNext = function(form){
                WizardHandler.wizard().checkValid(form);
                scope.isClicked = true;
            }

            scope.chargeSelected = function (chargeId) {

                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, this.formData, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        //to charge select box empty

                        if (data.penalty) {
                            scope.penalityFlag = true;
                            scope.penalityId = '';
                        } else {
                            scope.chargeFlag = true;
                            scope.chargeId = '';
                        }
                    });
                }
            };

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            };

            //advanced accounting rule
            scope.showOrHide = function (showOrHideValue) {

                if (showOrHideValue == "show") {
                    scope.showOrHideValue = 'hide';
                }

                if (showOrHideValue == "hide") {
                    scope.showOrHideValue = 'show';
                }
            };


            scope.addConfigureFundSource = function () {
                scope.frFlag = true;
                scope.configureFundOptions.push({
                    paymentTypeId: scope.product.paymentTypeOptions.length > 0 ? scope.product.paymentTypeOptions[0].id : '',
                    fundSourceAccountId: scope.assetAccountOptions.length > 0 ? scope.assetAccountOptions[0].id : '',
                    paymentTypeOptions: scope.product.paymentTypeOptions.length > 0 ? scope.product.paymentTypeOptions : [],
                    assetAccountOptions: scope.assetAccountOptions.length > 0 ? scope.assetAccountOptions : []
                });
            };

            scope.mapFees = function () {
                scope.fiFlag = true;
                scope.specificIncomeAccountMapping.push({
                    chargeId: scope.chargeOptions.length > 0 ? scope.chargeOptions[0].id : '',
                    incomeAccountId: scope.incomeAndLiabilityAccountOptions.length > 0 ? scope.incomeAndLiabilityAccountOptions[0].id : ''
                });
            };

            scope.addPrincipalVariation = function () {
                scope.pvFlag = true;
                scope.formData.principalVariationsForBorrowerCycle.push({
                    valueConditionType: scope.product.valueConditionTypeOptions[0].id
                });
            };
            scope.addInterestRateVariation = function () {
                scope.irFlag = true;
                scope.formData.interestRateVariationsForBorrowerCycle.push({
                    valueConditionType: scope.product.valueConditionTypeOptions[0].id
                });
            };
            scope.addNumberOfRepaymentVariation = function () {
                scope.rvFlag = true;
                scope.formData.numberOfRepaymentVariationsForBorrowerCycle.push({
                    valueConditionType: scope.product.valueConditionTypeOptions[0].id
                });
            };

            scope.mapPenalty = function () {
                scope.piFlag = true;
                scope.penaltySpecificIncomeaccounts.push({
                    chargeId: scope.penaltyOptions.length > 0 ? scope.penaltyOptions[0].id : '',
                    incomeAccountId: scope.incomeAccountOptions.length > 0 ? scope.incomeAccountOptions[0].id : ''
                });
            };

            scope.deleteFund = function (index) {
                scope.configureFundOptions.splice(index, 1);
            };

            scope.deleteFee = function (index) {
                scope.specificIncomeAccountMapping.splice(index, 1);
            };

            scope.deletePenalty = function (index) {
                scope.penaltySpecificIncomeaccounts.splice(index, 1);
            };

            scope.deletePrincipalVariation = function (index) {
                scope.formData.principalVariationsForBorrowerCycle.splice(index, 1);
            };

            scope.deleteInterestRateVariation = function (index) {
                scope.formData.interestRateVariationsForBorrowerCycle.splice(index, 1);
            };

            scope.deleterepaymentVariation = function (index) {
                scope.formData.numberOfRepaymentVariationsForBorrowerCycle.splice(index, 1);
            };

            scope.cancel = function () {
                location.path('/loanproducts');
            };


            scope.isAccountingEnabled = function () {
                if (scope.formData.accountingRule == 2 || scope.formData.accountingRule == 3 || scope.formData.accountingRule == 4) {
                    return true;
                }
                return false;
            }

            scope.isAccrualAccountingEnabled = function () {
                if (scope.formData.accountingRule == 3 || scope.formData.accountingRule == 4) {
                    return true;
                }
                return false;
            }
            scope.setAttributeValues = function(){
                if(scope.allowAttributeConfiguration == false){
                    scope.amortization = false;
                    scope.arrearsTolerance = false;
                    scope.graceOnArrearsAging = false;
                    scope.interestCalcPeriod = false;
                    scope.interestMethod = false;
                    scope.graceOnPrincipalAndInterest = false;
                    scope.repaymentFrequency = false;
                    scope.transactionProcessingStrategy = false;
                }
            }

	    scope.filterCharges = function(currencyCode, multiDisburseLoan) {
		return function (item) {
			if ((multiDisburseLoan != true) && item.chargeTimeType.id == 12) {
				return false;
			}
			if (item.currency.code != currencyCode) {
				return false;
			}
			return true;
		};
	    };

            scope.submit = function () {
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
                scope.paymentChannelToFundSourceMappings = [];
                scope.feeToIncomeAccountMappings = [];
                scope.penaltyToIncomeAccountMappings = [];
                scope.chargesSelected = [];
                scope.selectedConfigurableAttributes = [];

                var temp = '';

                //configure fund sources for payment channels
                for (var i in scope.configureFundOptions) {
                    temp = {
                        paymentTypeId: scope.configureFundOptions[i].paymentTypeId,
                        fundSourceAccountId: scope.configureFundOptions[i].fundSourceAccountId
                    }
                    scope.paymentChannelToFundSourceMappings.push(temp);
                }

                //map fees to specific income accounts
                for (var i in scope.specificIncomeAccountMapping) {
                    temp = {
                        chargeId: scope.specificIncomeAccountMapping[i].chargeId,
                        incomeAccountId: scope.specificIncomeAccountMapping[i].incomeAccountId
                    }
                    scope.feeToIncomeAccountMappings.push(temp);
                }

                //map penalties to specific income accounts
                for (var i in scope.penaltySpecificIncomeaccounts) {
                    temp = {
                        chargeId: scope.penaltySpecificIncomeaccounts[i].chargeId,
                        incomeAccountId: scope.penaltySpecificIncomeaccounts[i].incomeAccountId
                    }
                    scope.penaltyToIncomeAccountMappings.push(temp);
                }

                for (var i in scope.charges) {
                    temp = {
                        id: scope.charges[i].id
                    }
                    scope.chargesSelected.push(temp);
                }

                if(scope.allowAttributeConfiguration == false){
                    scope.amortization = false;
                    scope.arrearsTolerance = false;
                    scope.graceOnArrearsAging = false;
                    scope.interestCalcPeriod = false;
                    scope.interestMethod = false;
                    scope.graceOnPrincipalAndInterest = false;
                    scope.repaymentFrequency = false;
                    scope.transactionProcessingStrategy = false;
                }

                scope.selectedConfigurableAttributes =
                {amortizationType:scope.amortization,
                    interestType:scope.interestMethod,
                    transactionProcessingStrategyId:scope.transactionProcessingStrategy,
                    interestCalculationPeriodType:scope.interestCalcPeriod,
                    inArrearsTolerance:scope.arrearsTolerance,
                    repaymentEvery:scope.repaymentFrequency,
                    graceOnPrincipalAndInterestPayment:scope.graceOnPrincipalAndInterest,
                    graceOnArrearsAgeing:scope.graceOnArrearsAging};

                this.formData.paymentChannelToFundSourceMappings = scope.paymentChannelToFundSourceMappings;
                this.formData.feeToIncomeAccountMappings = scope.feeToIncomeAccountMappings;
                this.formData.penaltyToIncomeAccountMappings = scope.penaltyToIncomeAccountMappings;
                this.formData.charges = scope.chargesSelected;
                this.formData.allowAttributeOverrides = scope.selectedConfigurableAttributes;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.startDate = reqFirstDate;
                this.formData.closeDate = reqSecondDate;

                //Interest recalculation data
                if (this.formData.isInterestRecalculationEnabled) {
                    var restFrequencyDate = dateFilter(scope.date.recalculationRestFrequencyDate, scope.df);
                    scope.formData.recalculationRestFrequencyDate = restFrequencyDate;
                    var compoundingFrequencyDate = dateFilter(scope.date.recalculationCompoundingFrequencyDate, scope.df);
                    scope.formData.recalculationCompoundingFrequencyDate = compoundingFrequencyDate;
                }else{
                    delete scope.formData.interestRecalculationCompoundingMethod;
                    delete scope.formData.rescheduleStrategyMethod;
                    delete scope.formData.recalculationRestFrequencyType;
                    delete scope.formData.recalculationRestFrequencyInterval;
                }

                if(this.formData.isLinkedToFloatingInterestRates) {
                    delete scope.formData.interestRatePerPeriod ;
                    delete scope.formData.minInterestRatePerPeriod ;
                    delete scope.formData.maxInterestRatePerPeriod ;
                    delete scope.formData.interestRateFrequencyType ;
                }else {
                    delete scope.formData.floatingRatesId ;
                    delete scope.formData.interestRateDifferential ;
                    delete scope.formData.isFloatingInterestRateCalculationAllowed ;
                    delete scope.formData.minDifferentialLendingRate ;
                    delete scope.formData.defaultDifferentialLendingRate ;
                    delete scope.formData.maxDifferentialLendingRate ;

                }
                //If Variable Installments is not allowed for this product, remove the corresponding formData
                if(!this.formData.allowVariableInstallments) {
                    delete scope.formData.minimumGap ;
                    delete scope.formData.maximumGap ;
                }

                if(this.formData.interestCalculationPeriodType == 0){
                    this.formData.allowPartialPeriodInterestCalcualtion = false;
                }

                if (this.formData.recalculationCompoundingFrequencyType == 4) {
                    if(this.formData.recalculationCompoundingFrequencyNthDayType == -2) {
                        delete this.formData.recalculationCompoundingFrequencyNthDayType;
                        delete this.formData.recalculationCompoundingFrequencyDayOfWeekType;
                    } else {
                        delete this.formData.recalculationCompoundingFrequencyOnDayType;
                    }
                } else if (this.formData.recalculationCompoundingFrequencyType == 3){
                    delete this.formData.recalculationCompoundingFrequencyOnDayType;
                    delete this.formData.recalculationCompoundingFrequencyNthDayType;
                }

                if (this.formData.recalculationRestFrequencyType == 4) {
                    if(this.formData.recalculationRestFrequencyNthDayType == -2) {
                        delete this.formData.recalculationRestFrequencyNthDayType;
                        delete this.formData.recalculationRestFrequencyDayOfWeekType;
                    } else {
                        delete this.formData.recalculationRestFrequencyOnDayType;
                    }
                } else if (this.formData.recalculationRestFrequencyType == 3){
                    delete this.formData.recalculationRestFrequencyOnDayType;
                    delete this.formData.recalculationRestFrequencyNthDayType;
                }
                resourceFactory.loanProductResource.save(this.formData, function (data) {
                    location.path('/viewloanproduct/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateLoanProductController', ['$scope','$rootScope', 'ResourceFactory', '$location', 'dateFilter','WizardHandler', mifosX.controllers.CreateLoanProductController]).run(function ($log) {
        $log.info("CreateLoanProductController initialized");
    });
}(mifosX.controllers || {}));
