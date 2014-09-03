(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateLoanProductController: function (scope, resourceFactory, location, dateFilter) {
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.charges = [];
            scope.showOrHideValue = "show";
            scope.configureFundOptions = [];
            scope.specificIncomeaccounts = [];
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
            resourceFactory.loanProductResource.get({resourceType: 'template'}, function (data) {
                scope.product = data;
                scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions || [];
                scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions || [];
                scope.expenseAccountOptions = scope.product.accountingMappingOptions.expenseAccountOptions || [];
                scope.liabilityAccountOptions = data.accountingMappingOptions.liabilityAccountOptions || [];
                scope.penaltyOptions = scope.product.penaltyOptions || [];
                scope.overduecharges = [];
                for (var i in scope.penaltyOptions) {
                    if (scope.penaltyOptions[i].chargeTimeType.code == 'chargeTimeType.overdueInstallment') {
                        scope.overduecharges.push(scope.penaltyOptions[i]);
                    }
                }
                scope.formData.currencyCode = scope.product.currencyOptions[0].code;
                scope.formData.includeInBorrowerCycle = 'false';
                scope.formData.useBorrowerCycle = 'false';
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
                scope.formData.multiDisburseLoan = 'false';
                scope.formData.accountingRule = '1';
                scope.formData.daysInYearType = scope.product.daysInYearType.id;
                scope.formData.daysInMonthType = scope.product.daysInMonthType.id;
                scope.formData.isInterestRecalculationEnabled = scope.product.isInterestRecalculationEnabled;
                scope.formData.interestRecalculationCompoundingMethod = scope.product.interestRecalculationData.interestRecalculationCompoundingType.id;
                scope.formData.rescheduleStrategyMethod = scope.product.interestRecalculationData.rescheduleStrategyType.id;
            });

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
                scope.specificIncomeaccounts.push({
                    chargeId: scope.product.chargeOptions.length > 0 ? scope.product.chargeOptions[0].id : '',
                    incomeAccountId: scope.incomeAccountOptions.length > 0 ? scope.incomeAccountOptions[0].id : '',
                    chargeOptions: scope.product.chargeOptions.length > 0 ? scope.product.chargeOptions : [],
                    incomeAccountOptions: scope.incomeAccountOptions.length > 0 ? scope.incomeAccountOptions : []
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
                    incomeAccountId: scope.incomeAccountOptions.length > 0 ? scope.incomeAccountOptions[0].id : '',
                    penaltyOptions: scope.penaltyOptions.length > 0 ? scope.penaltyOptions : [],
                    incomeAccountOptions: scope.incomeAccountOptions.length > 0 ? scope.incomeAccountOptions : []
                });
            };

            scope.deleteFund = function (index) {
                scope.configureFundOptions.splice(index, 1);
            };

            scope.deleteFee = function (index) {
                scope.specificIncomeaccounts.splice(index, 1);
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

            scope.submit = function () {
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
                scope.paymentChannelToFundSourceMappings = [];
                scope.feeToIncomeAccountMappings = [];
                scope.penaltyToIncomeAccountMappings = [];
                scope.chargesSelected = [];

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
                for (var i in scope.specificIncomeaccounts) {
                    temp = {
                        chargeId: scope.specificIncomeaccounts[i].chargeId,
                        incomeAccountId: scope.specificIncomeaccounts[i].incomeAccountId
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

                this.formData.paymentChannelToFundSourceMappings = scope.paymentChannelToFundSourceMappings;
                this.formData.feeToIncomeAccountMappings = scope.feeToIncomeAccountMappings;
                this.formData.penaltyToIncomeAccountMappings = scope.penaltyToIncomeAccountMappings;
                this.formData.charges = scope.chargesSelected;
                this.formData.locale = "en";
                this.formData.dateFormat = scope.df;
                this.formData.startDate = reqFirstDate;
                this.formData.closeDate = reqSecondDate;

                //Interest recalculation data
                if (this.formData.isInterestRecalculationEnabled) {
                    var restFrequencyDate = dateFilter(scope.date.recalculationRestFrequencyDate, scope.df);
                    scope.formData.recalculationRestFrequencyDate = restFrequencyDate;
                }else{
                    delete scope.formData.interestRecalculationCompoundingMethod;
                    delete scope.formData.rescheduleStrategyMethod;
                    delete scope.formData.recalculationRestFrequencyType;
                    delete scope.formData.recalculationRestFrequencyInterval;
                }


                resourceFactory.loanProductResource.save(this.formData, function (data) {
                    location.path('/viewloanproduct/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateLoanProductController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateLoanProductController]).run(function ($log) {
        $log.info("CreateLoanProductController initialized");
    });
}(mifosX.controllers || {}));
