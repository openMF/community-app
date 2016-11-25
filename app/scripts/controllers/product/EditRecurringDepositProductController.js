(function (module) {
    mifosX.controllers = _.extend(module, {
        EditRecurringDepositProductController: function (scope, resourceFactory, location, routeParams, dateFilter,$uibModal) {
            scope.formData = {};
            scope.charges = [];
            scope.showOrHideValue = "show";
            scope.configureFundOptions = [];
            scope.specificIncomeaccounts = [];
            scope.penaltySpecificIncomeaccounts = [];
            scope.configureFundOption = {};

            //interest rate chart details
            scope.chart = {};
            scope.restrictDate = new Date();
            scope.fromDate = {}; //required for date formatting
            scope.endDate = {};//required for date formatting
            scope.deletedincentives = [];
            scope.isPrimaryGroupingByAmount = false;

            resourceFactory.recurringDepositProductResource.get({productId: routeParams.productId, template: 'true'}, function (data) {
                scope.product = data;
                scope.charges = data.charges;
                scope.assetAccountOptions = scope.product.accountingMappingOptions.assetAccountOptions || [];
                scope.liabilityAccountOptions = scope.product.accountingMappingOptions.liabilityAccountOptions || [];
                scope.incomeAccountOptions = scope.product.accountingMappingOptions.incomeAccountOptions || [];
                scope.expenseAccountOptions = scope.product.accountingMappingOptions.expenseAccountOptions || [];
                var preClosurePenalInterestOnTypeId = (_.isNull(data.preClosurePenalInterestOnType) || _.isUndefined(data.preClosurePenalInterestOnType)) ? '' : data.preClosurePenalInterestOnType.id;
                var minDepositTermTypeId = (_.isNull(data.minDepositTermType) || _.isUndefined(data.minDepositTermType)) ? '' : data.minDepositTermType.id;
                var maxDepositTermTypeId = (_.isNull(data.maxDepositTermType) || _.isUndefined(data.maxDepositTermType)) ? '' : data.maxDepositTermType.id;
                var inMultiplesOfDepositTermTypeId = (_.isNull(data.inMultiplesOfDepositTermType) || _.isUndefined(data.inMultiplesOfDepositTermType)) ? '' : data.inMultiplesOfDepositTermType.id;
                scope.formData = {
                    name: data.name,
                    shortName: data.shortName,
                    description: data.description,
                    currencyCode: data.currency.code,
                    digitsAfterDecimal: data.currency.decimalPlaces,
                    inMultiplesOf: data.currency.inMultiplesOf,
                    minDepositAmount: data.minDepositAmount,
                    depositAmount: data.depositAmount,
                    maxDepositAmount: data.maxDepositAmount,
                    nominalAnnualInterestRate: data.nominalAnnualInterestRate,
                    minRequiredOpeningBalance: data.minRequiredOpeningBalance,
                    lockinPeriodFrequency: data.lockinPeriodFrequency,
                    interestCompoundingPeriodType: data.interestCompoundingPeriodType.id,
                    interestPostingPeriodType: data.interestPostingPeriodType.id,
                    interestCalculationType: data.interestCalculationType.id,
                    interestCalculationDaysInYearType: data.interestCalculationDaysInYearType.id,
                    accountingRule: data.accountingRule.id,
                    preClosurePenalApplicable: data.preClosurePenalApplicable,
                    preClosurePenalInterest: data.preClosurePenalInterest,
                    preClosurePenalInterestOnTypeId: preClosurePenalInterestOnTypeId,
                    minDepositTerm: data.minDepositTerm,
                    maxDepositTerm: data.maxDepositTerm,
                    minDepositTermTypeId: minDepositTermTypeId,
                    maxDepositTermTypeId: maxDepositTermTypeId,
                    inMultiplesOfDepositTerm: data.inMultiplesOfDepositTerm,
                    inMultiplesOfDepositTermTypeId: inMultiplesOfDepositTermTypeId,
                    isMandatoryDeposit:data.isMandatoryDeposit,
                    allowWithdrawal:data.allowWithdrawal,
                    adjustAdvanceTowardsFuturePayments:data.adjustAdvanceTowardsFuturePayments,
                    minBalanceForInterestCalculation:data.minBalanceForInterestCalculation,
                    withHoldTax: data.withHoldTax == true ? 'true' : 'false'
                }

                if(data.withHoldTax){
                    scope.formData.taxGroupId = data.taxGroup.id;
                }
                scope.chart = scope.product.activeChart;

                _.each(scope.chart.chartSlabs, function (chartSlab) {
                    _.each(chartSlab.incentives, function (incentive){
                        incentive.attributeValue = parseInt(incentive.attributeValue);
                    })
                })
                //format chart date values
                if (scope.chart.fromDate) {
                    var fromDate = dateFilter(scope.chart.fromDate, scope.df);
                    scope.fromDate.date = new Date(fromDate);
                }
                if (scope.chart.endDate) {
                    var endDate = dateFilter(scope.chart.endDate, scope.df);
                    scope.endDate.date = new Date(endDate);
                }
                scope.isPrimaryGroupingByAmount = scope.chart.isPrimaryGroupingByAmount;

                if (data.lockinPeriodFrequencyType) {
                    scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
                }

                if (scope.formData.accountingRule == 2) {
                    scope.formData.savingsReferenceAccountId = data.accountingMappings.savingsReferenceAccount.id;
                    scope.formData.savingsControlAccountId = data.accountingMappings.savingsControlAccount.id;
                    scope.formData.transfersInSuspenseAccountId = data.accountingMappings.transfersInSuspenseAccount.id;
                    scope.formData.incomeFromFeeAccountId = data.accountingMappings.incomeFromFeeAccount.id;
                    scope.formData.incomeFromPenaltyAccountId = data.accountingMappings.incomeFromPenaltyAccount.id;
                    scope.formData.interestOnSavingsAccountId = data.accountingMappings.interestOnSavingsAccount.id;

                    _.each(scope.product.paymentChannelToFundSourceMappings, function (fundSource) {
                        scope.configureFundOptions.push({
                            paymentTypeId: fundSource.paymentType.id,
                            fundSourceAccountId: fundSource.fundSourceAccount.id,
                            paymentTypeOptions: scope.product.paymentTypeOptions,
                            assetAccountOptions: scope.assetAccountOptions
                        })
                    });

                    _.each(scope.product.feeToIncomeAccountMappings, function (fees) {
                        scope.specificIncomeaccounts.push({
                            chargeId: fees.charge.id,
                            incomeAccountId: fees.incomeAccount.id,
                            chargeOptions: scope.product.chargeOptions,
                            incomeAccountOptions: scope.incomeAccountOptions
                        })
                    });

                    _.each(scope.product.penaltyToIncomeAccountMappings, function (penalty) {
                        scope.penaltySpecificIncomeaccounts.push({
                            chargeId: penalty.charge.id,
                            incomeAccountId: penalty.incomeAccount.id,
                            penaltyOptions: scope.product.penaltyOptions,
                            incomeAccountOptions: scope.incomeAccountOptions
                        })
                    });
                }
            });

            //advanced accounting rule
            scope.showOrHide = function (showOrHideValue) {

                if (showOrHideValue == "show") {
                    scope.showOrHideValue = 'hide';
                }

                if (showOrHideValue == "hide") {
                    scope.showOrHideValue = 'show';
                }
            }

            scope.chargeSelected = function (chargeId) {
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, this.formData, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        //to charge select box empty
                        scope.chargeId = '';
                    });
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

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
            }

            scope.mapFees = function () {
                if (scope.product.chargeOptions && scope.product.chargeOptions.length > 0 && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
                    scope.specificIncomeaccounts.push({
                        chargeId: scope.product.chargeOptions[0].id,
                        incomeAccountId: scope.incomeAccountOptions[0].id,
                        chargeOptions: scope.product.chargeOptions,
                        incomeAccountOptions: scope.product.accountingMappingOptions.incomeAccountOptions
                    });
                }
            }

            scope.mapPenalty = function () {
                if (scope.product.penaltyOptions && scope.product.penaltyOptions.length > 0 && scope.incomeAccountOptions && scope.incomeAccountOptions.length > 0) {
                    scope.penaltySpecificIncomeaccounts.push({
                        chargeId: scope.product.penaltyOptions[0].id,
                        incomeAccountId: scope.incomeAccountOptions[0].id,
                        penaltyOptions: scope.product.penaltyOptions,
                        incomeAccountOptions: scope.incomeAccountOptions
                    });
                }
            }

            scope.deleteFund = function (index) {
                scope.configureFundOptions.splice(index, 1);
            }

            scope.deleteFee = function (index) {
                scope.specificIncomeaccounts.splice(index, 1);
            }

            scope.deletePenalty = function (index) {
                scope.penaltySpecificIncomeaccounts.splice(index, 1);
            }

            scope.cancel = function () {
                location.path('/viewrecurringdepositproduct/' + routeParams.productId);
            };

            scope.submit = function () {
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
                        incomeAccountId: scope.specificIncomeaccounts[i].incomeAccountId,
                    }
                    scope.feeToIncomeAccountMappings.push(temp);
                }

                //map penalties to specific income accounts
                for (var i in scope.penaltySpecificIncomeaccounts) {
                    temp = {
                        chargeId: scope.penaltySpecificIncomeaccounts[i].chargeId,
                        incomeAccountId: scope.penaltySpecificIncomeaccounts[i].incomeAccountId,
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
                this.formData.locale = scope.optlang.code;
                this.formData.charts = [];//declare charts array
                this.formData.charts.push(copyChartData(scope.chart));//add chart details
                this.formData = removeEmptyValues(this.formData);
                resourceFactory.recurringDepositProductResource.update({productId: routeParams.productId}, this.formData, function (data) {
                    location.path('/viewrecurringdepositproduct/' + data.resourceId);
                });
            }

            /**
             * Add a new row with default values for entering chart details
             */
            scope.addNewRow = function () {
                var fromPeriod = '';
                var amountRangeFrom = '';
                var periodType = '';
                var toPeriod = '';
                var amountRangeTo = '';
                if (_.isNull(scope.chart.chartSlabs) || _.isUndefined(scope.chart.chartSlabs)) {
                    scope.chart.chartSlabs = [];
                } else {
                    var lastChartSlab = {};
                    if (scope.chart.chartSlabs.length > 0) {
                        lastChartSlab = angular.copy(scope.chart.chartSlabs[scope.chart.chartSlabs.length - 1]);
                    }else{
                        lastChartSlab = null;
                    }
                    if (!(_.isNull(lastChartSlab) || _.isUndefined(lastChartSlab))) {
                        if(scope.isPrimaryGroupingByAmount){
                            if((_.isNull(lastChartSlab.toPeriod) || _.isUndefined(lastChartSlab.toPeriod) || lastChartSlab.toPeriod.length == 0)){
                                amountRangeFrom = _.isNull(lastChartSlab) ? '' : parseFloat(lastChartSlab.amountRangeTo) + 1;
                                fromPeriod = (_.isNull(lastChartSlab.fromPeriod) || _.isUndefined(lastChartSlab.fromPeriod) || lastChartSlab.fromPeriod.length == 0)? '' : 1;
                            }else{
                                amountRangeFrom = lastChartSlab.amountRangeFrom;
                                amountRangeTo = lastChartSlab.amountRangeTo;
                                fromPeriod = _.isNull(lastChartSlab) ? '' : parseInt(lastChartSlab.toPeriod) + 1;
                            }
                        }else{
                            if((_.isNull(lastChartSlab.amountRangeTo) || _.isUndefined(lastChartSlab.amountRangeTo) || lastChartSlab.amountRangeTo.length == 0)){
                                amountRangeFrom = (_.isNull(lastChartSlab.amountRangeFrom) || _.isUndefined(lastChartSlab.amountRangeFrom) || lastChartSlab.amountRangeFrom.length == 0) ? '' : 1;
                                fromPeriod = _.isNull(lastChartSlab) ? '' : parseFloat(lastChartSlab.toPeriod) + 1;
                            }else{
                                fromPeriod = lastChartSlab.fromPeriod;
                                toPeriod = lastChartSlab.toPeriod;
                                amountRangeFrom = _.isNull(lastChartSlab) ? '' : parseInt(lastChartSlab.amountRangeTo) + 1;
                            }
                        }
                        periodType = angular.copy(lastChartSlab.periodType);
                    }
                }


                var chartSlab = {
                    "periodType": periodType,
                    "fromPeriod": fromPeriod,
                    "amountRangeFrom": amountRangeFrom,
                    "incentives":[]
                };
                if(!_.isUndefined(toPeriod) && toPeriod.length > 0){
                    chartSlab.toPeriod = toPeriod;
                }
                if(!_.isUndefined(amountRangeTo) && amountRangeTo.length > 0){
                    chartSlab.amountRangeTo = amountRangeTo;
                }
                scope.chart.chartSlabs.push(chartSlab);
            }


            /**
             *  create new chart data object
             */

            copyChartData = function () {
                var newChartData = {
                    id: scope.chart.id,
                    //name: scope.chart.name,
                    //description: scope.chart.description,
                    fromDate: dateFilter(scope.fromDate.date, scope.df),
                    endDate: dateFilter(scope.endDate.date, scope.df),
                    isPrimaryGroupingByAmount:scope.isPrimaryGroupingByAmount,
                    //savingsProductId: scope.productId,
                    dateFormat: scope.df,
                    locale: scope.optlang.code,
                    chartSlabs: angular.copy(copyChartSlabs(scope.chart.chartSlabs))
                }

                //remove empty values
                _.each(newChartData, function (v, k) {
                    if (!v)
                        delete newChartData[k];
                });

                return newChartData;
            }

            /**
             *  copy all chart details to a new Array
             * @param chartSlabs
             * @returns {Array}
             */
            copyChartSlabs = function (chartSlabs) {
                var detailsArray = [];
                _.each(chartSlabs, function (chartSlab) {
                    var chartSlabData = copyChartSlab(chartSlab);
                    detailsArray.push(chartSlabData);
                });
                return detailsArray;
            }

            /**
             * create new chart detail object data from chartSlab
             * @param chartSlab
             *
             */

            copyChartSlab = function (chartSlab) {
                var newChartSlabData = {
                    id: chartSlab.id,
                    description: chartSlab.description,
                    fromPeriod: chartSlab.fromPeriod,
                    toPeriod: chartSlab.toPeriod,
                    amountRangeFrom: chartSlab.amountRangeFrom,
                    amountRangeTo: chartSlab.amountRangeTo,
                    annualInterestRate: chartSlab.annualInterestRate,
                    locale: scope.optlang.code,
                    incentives:angular.copy(copyIncentives(chartSlab.incentives,chartSlab.id))
                }
                if(chartSlab.periodType != undefined) {
                    newChartSlabData.periodType = chartSlab.periodType.id;
                }

                //remove empty values
                _.each(newChartSlabData, function (v, k) {
                    if (v === '') {
                        delete newChartSlabData[k];
                    }
                    if (!v && v != 0) {
                        delete newChartSlabData[k];
                    }

                });

                return newChartSlabData;
            }

            removeEmptyValues = function (objArray) {
                _.each(objArray, function (v, k) {
                    //alert(k + ':' + v);
                    if (_.isNull(v) || _.isUndefined(v) || v === '') {
                        //alert('remove' + k + ':' + v);
                        delete objArray[k];
                    }

                });

                return objArray;
            }

            /**
             * Remove chart details row
             */
            scope.removeRow = function (index) {
                scope.chart.chartSlabs.splice(index, 1);
            }
            scope.incentives = function(index){
                $uibModal.open({
                    templateUrl: 'incentive.html',
                    controller: IncentiveCtrl,
                    resolve: {
                        data: function () {
                            return scope.chart;
                        },
                        chartSlab: function () {
                            return scope.chart.chartSlabs[index];
                        }
                    }
                });
            }

            /**
             *  copy all chart details to a new Array
             * @param incentiveDatas
             * @returns {Array}
             */
            copyIncentives = function (incentives,slabId) {
                var detailsArray = [];
                _.each(incentives, function (incentive) {
                    var incentiveData = copyIncentive(incentive);
                    detailsArray.push(incentiveData);
                });
                _.each(scope.deletedincentives,function(del){
                    if(del.id == slabId){
                        detailsArray.push(del.data);
                    }
                });

                return detailsArray;
            }

            /**
             * create new chart detail object data from chartSlab
             * @param incentiveData
             *
             */

            copyIncentive = function (incentiveData) {
                var newIncentiveDataData = {
                    id: incentiveData.id,
                    "entityType":incentiveData.entityType,
                    "attributeName":incentiveData.attributeName.id,
                    "conditionType":incentiveData.conditionType.id,
                    "attributeValue":incentiveData.attributeValue,
                    "incentiveType":incentiveData.incentiveType.id,
                    "amount":incentiveData.amount,
                    locale: scope.optlang.code

                }
                if(incentiveData.id){
                    newIncentiveDataData.entityType = incentiveData.entityType.id;
                }
                return newIncentiveDataData;
            }

            var IncentiveCtrl = function ($scope, $uibModalInstance, data,chartSlab) {
                $scope.data = data;
                $scope.chartSlab = chartSlab;
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.addNewRow = function () {
                    var incentive = {
                        "entityType":"2",
                        "attributeName":"",
                        "conditionType":"",
                        "attributeValue":"",
                        "incentiveType":"",
                        "amount":""
                    };

                    $scope.chartSlab.incentives.push(incentive);
                }

                /**
                 * Remove chart details row
                 */
                $scope.removeRow = function (index) {
                    var incentive = {
                        id:$scope.chartSlab.incentives[index].id,
                        delete:'true'
                    }
                    var deldata = {
                        id:chartSlab.id,
                        data:incentive
                    }
                    scope.deletedincentives.push(deldata);
                    $scope.chartSlab.incentives.splice(index, 1);
                }
            };

        }
    });
    mifosX.ng.application.controller('EditRecurringDepositProductController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter','$uibModal', mifosX.controllers.EditRecurringDepositProductController]).run(function ($log) {
        $log.info("EditRecurringDepositProductController initialized");
    });
}(mifosX.controllers || {}));
