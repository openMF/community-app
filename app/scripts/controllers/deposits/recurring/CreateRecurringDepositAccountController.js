(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRecurringDepositAccountController: function (scope, resourceFactory, location, routeParams, dateFilter,$uibModal) {
            scope.products = [];
            scope.fieldOfficers = [];
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.clientId = routeParams.clientId;
            scope.groupId = routeParams.groupId;
            if (routeParams.centerEntity) {
                scope.centerEntity = true;
            }

            //interest rate chart details
            scope.chart = {};
            scope.fromDate = {}; //required for date formatting
            scope.endDate = {};//required for date formatting
            //scope.formData.expectedFirstDepositOnDate = {};

            scope.charges = [];
            scope.inparams = {};
            if (scope.clientId) {
                scope.inparams.clientId = scope.clientId
            }
            ;
            if (scope.groupId) {
                scope.inparams.groupId = scope.groupId
            }
            ;
            if (scope.centerId) {
                scope.inparams.centerId = scope.centerId
            }
            ;

            resourceFactory.recurringDepositAccountTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                scope.chargeOptions = data.chargeOptions;
                scope.clientName = data.clientName;
                scope.groupName = data.groupName;
            });

            scope.changeProduct = function () {
                scope.inparams.productId = scope.formData.productId;
                resourceFactory.recurringDepositAccountTemplateResource.get(scope.inparams, function (data) {

                    scope.data = data;
                    scope.charges = data.charges;

                    for (var i in scope.charges) {
                        if (scope.charges[i].chargeTimeType.value === "Annual Fee" && scope.charges[i].feeOnMonthDay) {
                            scope.charges[i].feeOnMonthDay.push('2013');
                            scope.charges[i].feeOnMonthDay = new Date(dateFilter(scope.charges[i].feeOnMonthDay, scope.df));
                        }
                    }
                    scope.fieldOfficers = data.fieldOfficerOptions;
                    scope.formData.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
                    scope.formData.lockinPeriodFrequency = data.lockinPeriodFrequency;
                    scope.formData.withHoldTax = data.withHoldTax;

                    if (data.interestCompoundingPeriodType) scope.formData.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
                    if (data.interestPostingPeriodType) scope.formData.interestPostingPeriodType = data.interestPostingPeriodType.id;
                    if (data.interestCalculationType) scope.formData.interestCalculationType = data.interestCalculationType.id;
                    if (data.interestCalculationDaysInYearType) scope.formData.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
                    if (data.lockinPeriodFrequencyType) scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
                    if (data.withdrawalFeeType) scope.formData.withdrawalFeeType = data.withdrawalFeeType.id;
                    if (data.interestFreePeriodApplicable) scope.formData.interestFreePeriodApplicable = data.interestFreePeriodApplicable;
                    if (data.preClosurePenalApplicable) scope.formData.preClosurePenalApplicable = data.preClosurePenalApplicable;

                    scope.chart = data.accountChart;
                    scope.chartSlabs = scope.chart.chartSlabs;
                    //format chart date values
                    if (scope.chart.fromDate) {
                        var fromDate = dateFilter(scope.chart.fromDate, scope.df);
                        scope.fromDate.date = new Date(fromDate);
                    }
                    if (scope.chart.endDate) {
                        var endDate = dateFilter(scope.chart.endDate, scope.df);
                        scope.endDate.date = new Date(endDate);
                    }

                    var preClosurePenalInterestOnTypeId = (_.isNull(data.preClosurePenalInterestOnType) || _.isUndefined(data.preClosurePenalInterestOnType)) ? '' : data.preClosurePenalInterestOnType.id;
                    var minDepositTermTypeId = (_.isNull(data.minDepositTermType) || _.isUndefined(data.minDepositTermType)) ? '' : data.minDepositTermType.id;
                    var maxDepositTermTypeId = (_.isNull(data.maxDepositTermType) || _.isUndefined(data.maxDepositTermType)) ? '' : data.maxDepositTermType.id;
                    var inMultiplesOfDepositTermTypeId = (_.isNull(data.inMultiplesOfDepositTermType) || _.isUndefined(data.inMultiplesOfDepositTermType)) ? '' : data.inMultiplesOfDepositTermType.id;

                    scope.formData.preClosurePenalApplicable = data.preClosurePenalApplicable;
                    scope.formData.preClosurePenalInterest = data.preClosurePenalInterest;
                    scope.formData.preClosurePenalInterestOnTypeId = preClosurePenalInterestOnTypeId;
                    scope.formData.minDepositTerm = data.minDepositTerm;
                    scope.formData.maxDepositTerm = data.maxDepositTerm;
                    scope.formData.minDepositTermTypeId = minDepositTermTypeId;
                    scope.formData.maxDepositTermTypeId = maxDepositTermTypeId;
                    scope.formData.inMultiplesOfDepositTerm = data.inMultiplesOfDepositTerm;
                    scope.formData.inMultiplesOfDepositTermTypeId = inMultiplesOfDepositTermTypeId;
                    scope.formData.isMandatoryDeposit = data.isMandatoryDeposit;
                    scope.formData.allowWithdrawal = data.allowWithdrawal;
                    //alert(data.allowWithdrawal + '='+ data.isMandatoryDeposit + '='+data.adjustAdvanceTowardsFuturePayments);
                    scope.formData.adjustAdvanceTowardsFuturePayments = data.adjustAdvanceTowardsFuturePayments;
                });
            };

            scope.addCharge = function (chargeId) {
                scope.errorchargeevent = false;
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        if (data.chargeTimeType.value == "Annual Fee") {
                            if (data.feeOnMonthDay) {
                                data.feeOnMonthDay.push(2013);
                                data.feeOnMonthDay = new Date(dateFilter(data.feeOnMonthDay, scope.df));
                            }
                        } else if (data.chargeTimeType.value == "Monthly Fee") {
                            if (data.feeOnMonthDay) {
                                data.feeOnMonthDay.push(2013);
                                data.feeOnMonthDay = new Date(dateFilter(data.feeOnMonthDay, scope.df));
                            }
                        }
                        scope.charges.push(data);
                        scope.chargeId = undefined;
                    });
                } else {
                    scope.errorchargeevent = true;
                    scope.labelchargeerror = "selectcharge";
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

            scope.submit = function () {
                if (scope.date) {
                    this.formData.submittedOnDate = dateFilter(scope.date.submittedOnDate, scope.df);
                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.monthDayFormat = "dd MMM";
                this.formData.charges = [];

                if (scope.clientId) this.formData.clientId = scope.clientId;
                if (scope.groupId) this.formData.groupId = scope.groupId;
                if (scope.centerId) this.formData.centerId = scope.centerId;

                if (scope.charges.length > 0) {
                    for (var i in scope.charges) {
                        if (scope.charges[i].chargeTimeType.value == 'Annual Fee') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                feeOnMonthDay: dateFilter(scope.charges[i].feeOnMonthDay, 'dd MMMM')});
                        } else if (scope.charges[i].chargeTimeType.value == 'Specified due date') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                dueDate: dateFilter(scope.charges[i].dueDate, scope.df)});
                        } else if (scope.charges[i].chargeTimeType.value == 'Monthly Fee') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                feeOnMonthDay: dateFilter(scope.charges[i].feeOnMonthDay, 'dd MMMM'), feeInterval: scope.charges[i].feeInterval});
                        } else {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount});
                        }
                    }
                }

                this.formData.charts = [];//declare charts array
                this.formData.charts.push(copyChartData(scope.chart));//add chart details
                this.formData = removeEmptyValues(this.formData);
                this.formData.isCalendarInherited = (_.isNull(this.formData.isCalendarInherited) || _.isUndefined(this.formData.isCalendarInherited)) ? false : this.formData.isCalendarInherited;

                if (scope.formData.expectedFirstDepositOnDate) {
                    this.formData.expectedFirstDepositOnDate = dateFilter(scope.formData.expectedFirstDepositOnDate, scope.df);
                }

                resourceFactory.recurringDepositAccountResource.save(this.formData, function (data) {
                    location.path('/viewrecurringdepositaccount/' + data.savingsId);
                });
            };

            scope.cancel = function () {
                if (scope.clientId) {
                    location.path('/viewclient/' + scope.clientId);
                } else if (scope.centerEntity) {
                    location.path('/viewcenter/' + scope.groupId);
                } else {
                    location.path('/viewgroup/' + scope.groupId);
                }
            }

            /**
             * Add a new row with default values for entering chart details
             */
            scope.addNewRow = function () {
                var fromPeriod = '';
                var amountRangeFrom = '';
                var periodType = '';
                if (_.isNull(scope.chart.chartSlabs) || _.isUndefined(scope.chart.chartSlabs)) {
                    scope.chart.chartSlabs = [];
                } else {
                    var lastChartSlab = {};
                    if (scope.chart.chartSlabs.length > 0) {
                        lastChartSlab = angular.copy(scope.chart.chartSlabs[scope.chart.chartSlabs.length - 1]);
                    }
                    if (!(_.isNull(lastChartSlab) || _.isUndefined(lastChartSlab))) {
                        fromPeriod = _.isNull(lastChartSlab) ? '' : parseInt(lastChartSlab.toPeriod) + 1;
                        amountRangeFrom = _.isNull(lastChartSlab) ? '' : parseFloat(lastChartSlab.amountRangeTo) + 1;
                        periodType = angular.copy(lastChartSlab.periodType);
                    }
                }


                var chartSlab = {
                    "periodType": periodType,
                    "fromPeriod": fromPeriod,
                    "amountRangeFrom": amountRangeFrom,
                    "incentives":[]
                };

                scope.chart.chartSlabs.push(chartSlab);
            }


            /**
             *  create new chart data object
             */

            copyChartData = function () {
                var newChartData = {
                    id: scope.chart.id,
                    name: scope.chart.name,
                    description: scope.chart.description,
                    fromDate: dateFilter(scope.fromDate.date, scope.df),
                    endDate: dateFilter(scope.endDate.date, scope.df),
                    isPrimaryGroupingByAmount:scope.chart.isPrimaryGroupingByAmount,
                    //savingsProductId: scope.productId,
                    dateFormat: scope.df,
                    locale: scope.optlang.code,
                    chartSlabs: angular.copy(copyChartSlabs(scope.chart.chartSlabs)),
                    isActiveChart: 'true'
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
                    incentives:angular.copy(copyIncentives(chartSlab.incentives))
                }

                if(chartSlab.periodType != undefined) {
                    newChartSlabData.periodType = chartSlab.periodType.id;
                }

                //remove empty values
                _.each(newChartSlabData, function (v, k) {
                    if (!v && v != 0)
                        delete newChartSlabData[k];
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
            copyIncentives = function (incentives) {
                var detailsArray = [];
                _.each(incentives, function (incentive) {
                    var incentiveData = copyIncentive(incentive);
                    detailsArray.push(incentiveData);
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
                    "amount":incentiveData.amount
                }
                return newIncentiveDataData;
            }

            var IncentiveCtrl = function ($scope, $uibModalInstance, data,chartSlab) {
                $scope.data = data;
                $scope.chartSlab = chartSlab;
                _.each($scope.chartSlab.incentives, function (incentive) {
                    if(!incentive.attributeValueDesc){
                        incentive.attributeValueDesc = incentive.attributeValue;
                    }
                });
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
                    $scope.chartSlab.incentives.splice(index, 1);
                }
            };

        }
    });
    mifosX.ng.application.controller('CreateRecurringDepositAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter','$uibModal', mifosX.controllers.CreateRecurringDepositAccountController]).run(function ($log) {
        $log.info("CreateRecurringDepositAccountController initialized");
    });
}(mifosX.controllers || {}));
