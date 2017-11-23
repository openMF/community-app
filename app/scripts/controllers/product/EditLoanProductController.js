(function (module) {
    mifosX.controllers = _.extend(module, {
        EditLoanProductController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.charges = [];
            scope.loanProductConfigurableAttributes = [];
            scope.showOrHideValue = "show";
            scope.configureFundOptions = [];
            scope.specificIncomeAccountMapping = [];
            scope.penaltySpecificIncomeaccounts = [];
            scope.configureFundOption = {};
            scope.date = {};
            scope.irFlag = false;
            scope.pvFlag = false;
            scope.rvFlag = false;
            scope.interestRecalculationOnDayTypeOptions = [];
            for (var i = 1; i <= 28; i++) {
                scope.interestRecalculationOnDayTypeOptions.push(i);
            }

            resourceFactory.loanProductResource.get({loanProductId: routeParams.id, template: 'true'}, function (data) {
                scope.product = data;
                scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions || [];
                scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions || [];
                scope.expenseAccountOptions = scope.product.accountingMappingOptions.expenseAccountOptions || [];
                scope.liabilityAccountOptions = data.accountingMappingOptions.liabilityAccountOptions || [];
                scope.incomeAndLiabilityAccountOptions = scope.incomeAccountOptions.concat(scope.liabilityAccountOptions);
                scope.penaltyOptions = scope.product.penaltyOptions || [];
                scope.chargeOptions = scope.product.chargeOptions || [];
                scope.charges = scope.product.charges || [];
                if (data.startDate) {
                    scope.date.first = new Date(data.startDate);
                }
                if (data.closeDate) {
                    scope.date.second = new Date(data.closeDate);
                }
                scope.overduecharges = [];
                for (var i in scope.penaltyOptions) {
                    if(scope.penaltyOptions[i].chargeTimeType.code == 'chargeTimeType.overdueInstallment')
                    {
                        scope.overduecharges.push(scope.penaltyOptions[i]);
                    }
                }
                scope.product.interestRecalculationNthDayTypeOptions.push({"code" : "onDay", "id" : -2, "value" : "on day"});
                scope.formData = {
                    name: scope.product.name,
                    shortName: scope.product.shortName,
                    description: scope.product.description,
                    fundId: scope.product.fundId,
                    description: scope.product.description,
                    includeInBorrowerCycle: scope.product.includeInBorrowerCycle,
                    useBorrowerCycle: scope.product.useBorrowerCycle,
                    currencyCode: scope.product.currency.code,
                    digitsAfterDecimal: scope.product.currency.decimalPlaces,
                    inMultiplesOf: scope.product.currency.inMultiplesOf,
                    principal: scope.product.principal,
                    minPrincipal: scope.product.minPrincipal,
                    maxPrincipal: scope.product.maxPrincipal,
                    numberOfRepayments: scope.product.numberOfRepayments,
                    minNumberOfRepayments: scope.product.minNumberOfRepayments,
                    maxNumberOfRepayments: scope.product.maxNumberOfRepayments,
                    repaymentEvery: scope.product.repaymentEvery,
                    repaymentFrequencyType: scope.product.repaymentFrequencyType.id,
                    interestRatePerPeriod: scope.product.interestRatePerPeriod,
                    minInterestRatePerPeriod: scope.product.minInterestRatePerPeriod,
                    maxInterestRatePerPeriod: scope.product.maxInterestRatePerPeriod,
                    interestRateFrequencyType: scope.product.interestRateFrequencyType.id,
                    amortizationType: scope.product.amortizationType.id,
                    interestType: scope.product.interestType.id,
                    interestCalculationPeriodType: scope.product.interestCalculationPeriodType.id,
                    allowPartialPeriodInterestCalcualtion:scope.product.allowPartialPeriodInterestCalcualtion,
                    inArrearsTolerance: scope.product.inArrearsTolerance,
                    transactionProcessingStrategyId: scope.product.transactionProcessingStrategyId,
                    graceOnPrincipalPayment: scope.product.graceOnPrincipalPayment,
                    graceOnInterestPayment: scope.product.graceOnInterestPayment,
                    graceOnInterestCharged: scope.product.graceOnInterestCharged,
                    graceOnArrearsAgeing: scope.product.graceOnArrearsAgeing,
                    overdueDaysForNPA: scope.product.overdueDaysForNPA,
                    accountMovesOutOfNPAOnlyOnArrearsCompletion: scope.product.accountMovesOutOfNPAOnlyOnArrearsCompletion,
                    accountingRule: scope.product.accountingRule.id,
                    principalVariationsForBorrowerCycle: [],
                    interestRateVariationsForBorrowerCycle: [],
                    numberOfRepaymentVariationsForBorrowerCycle: [],
                    multiDisburseLoan: scope.product.multiDisburseLoan,
                    maxTrancheCount: scope.product.maxTrancheCount,
                    outstandingLoanBalance: scope.product.outstandingLoanBalance,
                    daysInYearType: scope.product.daysInYearType.id,
                    daysInMonthType: scope.product.daysInMonthType.id,
                    isInterestRecalculationEnabled: scope.product.isInterestRecalculationEnabled,
                    holdGuaranteeFunds:scope.product.holdGuaranteeFunds,
                    minimumDaysBetweenDisbursalAndFirstRepayment: scope.product.minimumDaysBetweenDisbursalAndFirstRepayment,
                    principalThresholdForLastInstallment: scope.product.principalThresholdForLastInstallment,
                    installmentAmountInMultiplesOf: scope.product.installmentAmountInMultiplesOf,
                    canDefineInstallmentAmount : scope.product.canDefineInstallmentAmount,
                    isEqualAmortization : scope.product.isEqualAmortization,
                };

                if (scope.product.isInterestRecalculationEnabled) {
                    scope.formData.interestRecalculationCompoundingMethod = scope.product.interestRecalculationData.interestRecalculationCompoundingType.id;
                    scope.formData.rescheduleStrategyMethod = scope.product.interestRecalculationData.rescheduleStrategyType.id;
                    scope.formData.recalculationRestFrequencyType = scope.product.interestRecalculationData.recalculationRestFrequencyType.id;
                    scope.formData.recalculationRestFrequencyInterval = scope.product.interestRecalculationData.recalculationRestFrequencyInterval;
                    scope.formData.isArrearsBasedOnOriginalSchedule = scope.product.interestRecalculationData.isArrearsBasedOnOriginalSchedule;
                    scope.formData.preClosureInterestCalculationStrategy = scope.product.interestRecalculationData.preClosureInterestCalculationStrategy.id;
                    if (scope.product.interestRecalculationData.recalculationRestFrequencyOnDay != null) {
                        scope.formData.recalculationRestFrequencyNthDayType = -2;
                        scope.formData.recalculationRestFrequencyOnDayType = scope.product.interestRecalculationData.recalculationRestFrequencyOnDay;
                    } else {
                        if (scope.product.interestRecalculationData.recalculationRestFrequencyNthDay != null)
                            scope.formData.recalculationRestFrequencyNthDayType = scope.product.interestRecalculationData.recalculationRestFrequencyNthDay.id;
                        if (scope.product.interestRecalculationData.recalculationRestFrequencyWeekday != null)
                            scope.formData.recalculationRestFrequencyDayOfWeekType = scope.product.interestRecalculationData.recalculationRestFrequencyWeekday.id;
                    }
                    if(scope.formData.interestRecalculationCompoundingMethod != 0){
                        scope.formData.recalculationCompoundingFrequencyType = scope.product.interestRecalculationData.recalculationCompoundingFrequencyType.id;
                        scope.formData.recalculationCompoundingFrequencyInterval = scope.product.interestRecalculationData.recalculationCompoundingFrequencyInterval;
                        
                        if (scope.product.interestRecalculationData.recalculationCompoundingFrequencyOnDay != null) {
                            scope.formData.recalculationCompoundingFrequencyNthDayType = -2;
                            scope.formData.recalculationCompoundingFrequencyOnDayType = scope.product.interestRecalculationData.recalculationCompoundingFrequencyOnDay;
                        } else {
                            if (scope.product.interestRecalculationData.recalculationCompoundingFrequencyNthDay != null)
                                scope.formData.recalculationCompoundingFrequencyNthDayType = scope.product.interestRecalculationData.recalculationCompoundingFrequencyNthDay.id;
                            if (scope.product.interestRecalculationData.recalculationCompoundingFrequencyWeekday != null)
                                scope.formData.recalculationCompoundingFrequencyDayOfWeekType = scope.product.interestRecalculationData.recalculationCompoundingFrequencyWeekday.id;
                        }
                    }

                }
                if(scope.product.allowAttributeOverrides != null){
                    console.log('scope.product.allowAttributeOverrides : ',scope.product.allowAttributeOverrides);
                    scope.amortization = scope.product.allowAttributeOverrides.amortizationType;
                    scope.arrearsTolerance = scope.product.allowAttributeOverrides.inArrearsTolerance;
                    scope.graceOnArrearsAging = scope.product.allowAttributeOverrides.graceOnArrearsAgeing;
                    scope.interestCalcPeriod = scope.product.allowAttributeOverrides.interestCalculationPeriodType;
                    scope.interestMethod = scope.product.allowAttributeOverrides.interestType;
                    scope.graceOnPrincipalAndInterest = scope.product.allowAttributeOverrides.graceOnPrincipalAndInterestPayment;
                    scope.repaymentFrequency = scope.product.allowAttributeOverrides.repaymentEvery;
                    scope.transactionProcessingStrategy = scope.product.allowAttributeOverrides.transactionProcessingStrategyId;
                }
                if(scope.amortization || scope.arrearsTolerance || scope.graceOnArrearsAgeing ||
                scope.interestCalcPeriod || scope.interestMethod || scope.graceOnPrincipalAndInterest ||
                scope.repaymentFrequency || scope.transactionProcessingStrategy == true){
                    scope.allowAttributeConfiguration = true;
                }
                else{
                    scope.allowAttributeConfiguration = false;
                }

                if (scope.product.holdGuaranteeFunds) {
                    scope.formData.mandatoryGuarantee = scope.product.productGuaranteeData.mandatoryGuarantee;
                    scope.formData.minimumGuaranteeFromOwnFunds = scope.product.productGuaranteeData.minimumGuaranteeFromOwnFunds;
                    scope.formData.minimumGuaranteeFromGuarantor = scope.product.productGuaranteeData.minimumGuaranteeFromGuarantor;
                }

                _.each(scope.product.principalVariationsForBorrowerCycle, function (variation) {
                    scope.formData.principalVariationsForBorrowerCycle.push({
                        id: variation.id,
                        borrowerCycleNumber: variation.borrowerCycleNumber,
                        valueConditionType: variation.valueConditionType.id,
                        minValue: variation.minValue,
                        maxValue: variation.maxValue,
                        defaultValue: variation.defaultValue
                    })
                });

                _.each(scope.product.interestRateVariationsForBorrowerCycle, function (variation) {
                    scope.formData.interestRateVariationsForBorrowerCycle.push({
                        id: variation.id,
                        borrowerCycleNumber: variation.borrowerCycleNumber,
                        valueConditionType: variation.valueConditionType.id,
                        minValue: variation.minValue,
                        maxValue: variation.maxValue,
                        defaultValue: variation.defaultValue
                    })
                });

                _.each(scope.product.numberOfRepaymentVariationsForBorrowerCycle, function (variation) {
                    scope.formData.numberOfRepaymentVariationsForBorrowerCycle.push({
                        id: variation.id,
                        borrowerCycleNumber: variation.borrowerCycleNumber,
                        valueConditionType: variation.valueConditionType.id,
                        minValue: variation.minValue,
                        maxValue: variation.maxValue,
                        defaultValue: variation.defaultValue
                    })
                });

                scope.setFlag();
                if (scope.formData.accountingRule == 2 || scope.formData.accountingRule == 3 || scope.formData.accountingRule == 4) {
                    scope.formData.fundSourceAccountId = scope.product.accountingMappings.fundSourceAccount.id;
                    scope.formData.loanPortfolioAccountId = scope.product.accountingMappings.loanPortfolioAccount.id;
                    if (scope.formData.accountingRule == 3 || scope.formData.accountingRule == 4) {
                        scope.formData.receivableInterestAccountId = scope.product.accountingMappings.receivableInterestAccount.id;
                        scope.formData.receivableFeeAccountId = scope.product.accountingMappings.receivableFeeAccount.id;
                        scope.formData.receivablePenaltyAccountId = scope.product.accountingMappings.receivablePenaltyAccount.id;
                    }

                    scope.formData.transfersInSuspenseAccountId = scope.product.accountingMappings.transfersInSuspenseAccount.id;
                    scope.formData.interestOnLoanAccountId = scope.product.accountingMappings.interestOnLoanAccount.id;
                    scope.formData.incomeFromFeeAccountId = scope.product.accountingMappings.incomeFromFeeAccount.id;
                    scope.formData.incomeFromPenaltyAccountId = scope.product.accountingMappings.incomeFromPenaltyAccount.id;
                    scope.formData.incomeFromRecoveryAccountId = scope.product.accountingMappings.incomeFromRecoveryAccount.id;
                    scope.formData.writeOffAccountId = scope.product.accountingMappings.writeOffAccount.id;
                    scope.formData.overpaymentLiabilityAccountId = scope.product.accountingMappings.overpaymentLiabilityAccount.id;

                    _.each(scope.product.paymentChannelToFundSourceMappings, function (fundSource) {
                        scope.configureFundOptions.push({
                            paymentTypeId: fundSource.paymentType.id,
                            fundSourceAccountId: fundSource.fundSourceAccount.id,
                            paymentTypeOptions: scope.product.paymentTypeOptions,
                            assetAccountOptions: scope.assetAccountOptions
                        })
                    });

                    _.each(scope.product.feeToIncomeAccountMappings, function (fees) {
                        scope.specificIncomeAccountMapping.push({
                            chargeId: fees.charge.id,
                            incomeAccountId: fees.incomeAccount.id
                        })
                    });

                    _.each(scope.product.penaltyToIncomeAccountMappings, function (penalty) {
                        scope.penaltySpecificIncomeaccounts.push({
                            chargeId: penalty.charge.id,
                            incomeAccountId: penalty.incomeAccount.id
                        })
                    });
                }

                scope.formData.isLinkedToFloatingInterestRates = data.isLinkedToFloatingInterestRates ;
                scope.formData.floatingRatesId = data.floatingRateId ;
                scope.formData.interestRateDifferential = data.interestRateDifferential ;
                scope.formData.isFloatingInterestRateCalculationAllowed = data.isFloatingInterestRateCalculationAllowed ;
                scope.formData.minDifferentialLendingRate = data.minDifferentialLendingRate ;
                scope.formData.defaultDifferentialLendingRate = data.defaultDifferentialLendingRate ;
                scope.formData.maxDifferentialLendingRate = data.maxDifferentialLendingRate ;
                scope.floatingRateOptions = data.floatingRateOptions ;
                scope.formData.allowVariableInstallments = scope.product.allowVariableInstallments ;
                scope.formData.minimumGap = scope.product.minimumGap;
                scope.formData.maximumGap = scope.product.maximumGap;
                scope.formData.canUseForTopup = scope.product.canUseForTopup;
            });

            scope.chargeSelected = function (chargeId) {
                if(chargeId){
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, this.formData, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        //to charge select box empty
                        scope.chargeId = '';
                        scope.penalityId = '';
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
                if (scope.product.paymentTypeOptions && scope.product.paymentTypeOptions.length > 0 &&
                    scope.assetAccountOptions && scope.assetAccountOptions.length > 0) {
                    scope.configureFundOptions.push({
                        paymentTypeId: scope.product.paymentTypeOptions[0].id,
                        fundSourceAccountId: scope.assetAccountOptions[0].id,
                        paymentTypeOptions: scope.product.paymentTypeOptions,
                        assetAccountOptions: scope.assetAccountOptions
                    });
                }
            };

            scope.mapFees = function () {
                if (scope.product.chargeOptions && scope.product.chargeOptions.length > 0 && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
                    scope.specificIncomeAccountMapping.push({
                        chargeId: scope.chargeOptions.length > 0 ? scope.chargeOptions[0].id : '',
                        incomeAccountId: scope.incomeAndLiabilityAccountOptions.length > 0 ? scope.incomeAndLiabilityAccountOptions[0].id : ''
                    });
                }
            };

            scope.mapPenalty = function () {
                if (scope.product.penaltyOptions && scope.product.penaltyOptions.length > 0 && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
                    scope.penaltySpecificIncomeaccounts.push({
                        chargeId: scope.penaltyOptions.length > 0 ? scope.penaltyOptions[0].id : '',
                        incomeAccountId: scope.incomeAccountOptions.length > 0 ? scope.incomeAccountOptions[0].id : ''
                    });
                }
            };

            scope.addPrincipalVariation = function () {
                scope.pvFlag = true;
                scope.formData.principalVariationsForBorrowerCycle.push({
                    valueConditionType: scope.product.valueConditionTypeOptions[0].id
                })
            };
            scope.addInterestRateVariation = function () {
                scope.irFlag = true;
                scope.formData.interestRateVariationsForBorrowerCycle.push({
                    valueConditionType: scope.product.valueConditionTypeOptions[0].id
                })
            };
            scope.addNumberOfRepaymentVariation = function () {
                scope.rvFlag = true;
                scope.formData.numberOfRepaymentVariationsForBorrowerCycle.push({
                    valueConditionType: scope.product.valueConditionTypeOptions[0].id
                })
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

            scope.setFlag = function () {
                if (scope.formData.principalVariationsForBorrowerCycle) {
                    scope.pvFlag = true;
                }
                if (scope.formData.numberOfRepaymentVariationsForBorrowerCycle) {
                    scope.rvFlag = true;
                }
                if (scope.formData.interestRateVariationsForBorrowerCycle) {
                    scope.irFlag = true;
                }
            };
            scope.setFlag();

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

            scope.submit = function () {
                scope.paymentChannelToFundSourceMappings = [];
                scope.feeToIncomeAccountMappings = [];
                scope.penaltyToIncomeAccountMappings = [];
                scope.chargesSelected = [];
                scope.selectedConfigurableAttributes = [];
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
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
                this.formData.dateFormat = scope.df;
                this.formData.locale = scope.optlang.code;
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

                resourceFactory.loanProductResource.put({loanProductId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewloanproduct/' + data.resourceId);
                });
            }
        }
    });
    mifosX.ng.application.controller('EditLoanProductController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditLoanProductController]).run(function ($log) {
        $log.info("EditLoanProductController initialized");
    });
}(mifosX.controllers || {}));
