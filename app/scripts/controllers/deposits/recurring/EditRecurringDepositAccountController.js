(function(module) {
  mifosX.controllers = _.extend(module, {
    EditRecurringDepositAccountController: function(scope, resourceFactory, location, routeParams, dateFilter) {
        scope.products = [];
        scope.fieldOfficers = [];
        scope.formData = {};
        scope.accountId = routeParams.id;
        scope.charges = [];
        scope.restrictDate = new Date();
        //interest rate chart details
        scope.chart = {};
        scope.fromDate = {}; //required for date formatting
        scope.endDate = {};//required for date formatting

        resourceFactory.recurringDepositAccountResource.get({accountId:scope.accountId, template:'true', associations : 'charges'}, function(data) {
          scope.data = data;
          scope.charges = data.charges || [];
          if (scope.charges) {
              for (var i in scope.charges) {
                  if(scope.charges[i].chargeTimeType.value=='Annual Fee') {
                      scope.charges[i].feeOnMonthDay.push(2013);
                      scope.charges[i].feeOnMonthDay = new Date(dateFilter(scope.charges[i].feeOnMonthDay, scope.df));
                  } else if(scope.charges[i].chargeTimeType.value== "Monthly Fee") {
                      scope.charges[i].feeOnMonthDay.push(2013);
                      scope.charges[i].feeOnMonthDay = new Date(dateFilter(scope.charges[i].feeOnMonthDay, scope.df));
                  } else if(scope.charges[i].chargeTimeType.value=='Specified due date') {
                      scope.charges[i].dueDate = new Date(dateFilter(scope.charges[i].dueDate, scope.df));
                  } 
              }
          }

          if (data.clientId) {
            scope.formData.clientId = data.clientId;
            scope.clientName = data.clientName;
          }
          if (data.groupId) {
            scope.formData.groupId = data.groupId;
            scope.groupName = data.groupName;
          }
          scope.formData.productId = data.savingsProductId;
          scope.products = data.productOptions;
          if(data.fieldOfficerId != 0)scope.formData.fieldOfficerId = data.fieldOfficerId;
          if(data.timeline) {
            var submittedOnDate = dateFilter(data.timeline.submittedOnDate, scope.df);
            scope.formData.submittedOnDate = new Date(submittedOnDate);
          }
          scope.fieldOfficers = data.fieldOfficerOptions;
          scope.formData.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
          scope.formData.minRequiredOpeningBalance = data.minRequiredOpeningBalance;
          scope.formData.lockinPeriodFrequency = data.lockinPeriodFrequency;
          /* FIX-ME: uncomment annualFeeAmount when datepicker avialable, because it depends on the date field 'annualFeeOnMonthDay'*/
          //scope.formData.annualFeeAmount = data.annualFeeAmount;
          //scope.formData.withdrawalFeeAmount = data.withdrawalFeeAmount;
          //scope.formData.withdrawalFeeForTransfers = data.withdrawalFeeForTransfers;

          if (data.interestCompoundingPeriodType) scope.formData.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
          if (data.interestPostingPeriodType) scope.formData.interestPostingPeriodType = data.interestPostingPeriodType.id;
          if (data.interestCalculationType) scope.formData.interestCalculationType = data.interestCalculationType.id;
          if (data.interestCalculationDaysInYearType) scope.formData.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
          if (data.lockinPeriodFrequencyType) scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
          //if (data.withdrawalFeeType) scope.formData.withdrawalFeeType = data.withdrawalFeeType.id;

          scope.chart = data.accountChart;
          //format chart date values
          if (scope.chart.fromDate) {
            var fromDate = dateFilter(scope.chart.fromDate, scope.df);
            scope.fromDate.date = new Date(fromDate);
          }
          if (scope.chart.endDate) {
            var endDate = dateFilter(scope.chart.endDate, scope.df);
            scope.endDate.date = new Date(endDate);
          }

          var interestFreePeriodFrequencyTypeId = (_.isNull(data.interestFreePeriodFrequencyType) || _.isUndefined(data.interestFreePeriodFrequencyType)) ? '' : data.interestFreePeriodFrequencyType.id;
          var preClosurePenalInterestOnTypeId = (_.isNull(data.preClosurePenalInterestOnType) || _.isUndefined(data.preClosurePenalInterestOnType)) ? '' : data.preClosurePenalInterestOnType.id;
          var depositTermTypeId = (_.isNull(data.depositTermType) || _.isUndefined(data.depositTermType)) ? '' : data.depositTermType.id;
          var inMultiplesOfDepositTermTypeId = (_.isNull(data.inMultiplesOfDepositTermType) || _.isUndefined(data.inMultiplesOfDepositTermType)) ? '' : data.inMultiplesOfDepositTermType.id;

          scope.formData.interestFreePeriodApplicable = data.interestFreePeriodApplicable;
          scope.formData.interestFreeFromPeriod = data.interestFreeFromPeriod;
          scope.formData.interestFreeToPeriod = data.interestFreeToPeriod;
          scope.formData.interestFreePeriodFrequencyTypeId = interestFreePeriodFrequencyTypeId;
          scope.formData.preClosurePenalApplicable = data.preClosurePenalApplicable;
          scope.formData.preClosurePenalInterest = data.preClosurePenalInterest;
          scope.formData.preClosurePenalInterestOnTypeId = preClosurePenalInterestOnTypeId;
          scope.formData.minDepositTerm = data.minDepositTerm;
          scope.formData.maxDepositTerm = data.maxDepositTerm;
          scope.formData.depositTermTypeId = depositTermTypeId;
          scope.formData.inMultiplesOfDepositTerm = data.inMultiplesOfDepositTerm;
          scope.formData.inMultiplesOfDepositTermTypeId = inMultiplesOfDepositTermTypeId;

        });
        
         scope.changeProduct =function() {
          var inparams = {productId : scope.formData.productId};
          if (scope.formData.clientId) inparams.clientId = scope.formData.clientId;
          if (scope.formData.groupId) inparams.groupId = scope.formData.groupId;
          resourceFactory.recurringDepositAccountTemplateResource.get(inparams, function(data) {

            scope.data = data;

            scope.fieldOfficers = data.fieldOfficerOptions;
            scope.formData.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
            scope.formData.minRequiredOpeningBalance = data.minRequiredOpeningBalance;
            scope.formData.lockinPeriodFrequency = data.lockinPeriodFrequency;
            /* FIX-ME: uncomment annualFeeAmount when datepicker avialable, because it depends on the date field 'annualFeeOnMonthDay'*/
            //scope.formData.annualFeeAmount = data.annualFeeAmount;
            //scope.formData.withdrawalFeeAmount = data.withdrawalFeeAmount;
            //scope.formData.withdrawalFeeForTransfers = data.withdrawalFeeForTransfers;

            if (data.interestCompoundingPeriodType) scope.formData.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
            if (data.interestPostingPeriodType) scope.formData.interestPostingPeriodType = data.interestPostingPeriodType.id;
            if (data.interestCalculationType) scope.formData.interestCalculationType = data.interestCalculationType.id;
            if (data.interestCalculationDaysInYearType) scope.formData.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
            if (data.lockinPeriodFrequencyType) scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
            //if (data.withdrawalFeeType) scope.formData.withdrawalFeeType = data.withdrawalFeeType.id;

            scope.chart = data.accountChart;
            //format chart date values
            if (scope.chart.fromDate) {
              var fromDate = dateFilter(scope.chart.fromDate, scope.df);
              scope.fromDate.date = new Date(fromDate);
            }
            if (scope.chart.endDate) {
              var endDate = dateFilter(scope.chart.endDate, scope.df);
              scope.endDate.date = new Date(endDate);
            }

            var interestFreePeriodFrequencyTypeId = (_.isNull(data.interestFreePeriodFrequencyType) || _.isUndefined(data.interestFreePeriodFrequencyType)) ? '' : data.interestFreePeriodFrequencyType.id;
            var preClosurePenalInterestOnTypeId = (_.isNull(data.preClosurePenalInterestOnType) || _.isUndefined(data.preClosurePenalInterestOnType)) ? '' : data.preClosurePenalInterestOnType.id;
            var depositTermTypeId = (_.isNull(data.depositTermType) || _.isUndefined(data.depositTermType)) ? '' : data.depositTermType.id;
            var inMultiplesOfDepositTermTypeId = (_.isNull(data.inMultiplesOfDepositTermType) || _.isUndefined(data.inMultiplesOfDepositTermType)) ? '' : data.inMultiplesOfDepositTermType.id;

            scope.formData.interestFreePeriodApplicable = data.interestFreePeriodApplicable;
            scope.formData.interestFreeFromPeriod = data.interestFreeFromPeriod;
            scope.formData.interestFreeToPeriod = data.interestFreeToPeriod;
            scope.formData.interestFreePeriodFrequencyTypeId = interestFreePeriodFrequencyTypeId;
            scope.formData.preClosurePenalApplicable = data.preClosurePenalApplicable;
            scope.formData.preClosurePenalInterest = data.preClosurePenalInterest;
            scope.formData.preClosurePenalInterestOnTypeId = preClosurePenalInterestOnTypeId;
            scope.formData.minDepositTerm = data.minDepositTerm;
            scope.formData.maxDepositTerm = data.maxDepositTerm;
            scope.formData.depositTermTypeId = depositTermTypeId;
            scope.formData.inMultiplesOfDepositTerm = data.inMultiplesOfDepositTerm;
            scope.formData.inMultiplesOfDepositTermTypeId = inMultiplesOfDepositTermTypeId;

          });
        }

        scope.addCharge = function(chargeId) {
          scope.errorchargeevent = false;
          if (chargeId) {
            resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function(data){
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

                delete data.id;
                scope.charges.push(data);
                scope.chargeId = undefined;
            });
          } else {
              scope.errorchargeevent = true;
              scope.labelchargeerror = "selectcharge";
          }
        }

        scope.deleteCharge = function(index) {
          scope.charges.splice(index,1);
        }
        
        scope.cancel = function() {
          location.path('/viewsavingaccount/' +scope.accountId);
        }

        scope.submit = function() {
          if(this.formData.submittedOnDate)  this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate,scope.df);
          this.formData.locale = scope.optlang.code;
          this.formData.dateFormat = scope.df;
          this.formData.monthDayFormat= "dd MMM";
          scope.formData.charges = [];
          if (scope.charges.length > 0) {
              for (var i in scope.charges) {
                  if(scope.charges[i].chargeTimeType.value=='Annual Fee') {
                      this.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount,
                      feeOnMonthDay:dateFilter(scope.charges[i].feeOnMonthDay,'dd MMMM')});
                  } else if(scope.charges[i].chargeTimeType.value=='Specified due date') {
                      this.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount,
                      dueDate:dateFilter(scope.charges[i].dueDate,scope.df)});
                  }else if(scope.charges[i].chargeTimeType.value=='Monthly Fee') {
                      this.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount,
                      feeOnMonthDay:dateFilter(scope.charges[i].feeOnMonthDay,'dd MMMM'), feeInterval : scope.charges[i].feeInterval});
                  } else {
                      this.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount});
                  }
              }
          }

          this.formData.charts = [];//declare charts array
          this.formData.charts.push(copyChartData(scope.chart));//add chart details
          this.formData = removeEmptyValues(this.formData);

          resourceFactory.recurringDepositAccountResource.update({'accountId': scope.accountId}, this.formData, function(data){
            location.path('/viewrecurringdepositaccount/' + data.savingsId);
          });
        };

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
            if(scope.chart.chartSlabs.length > 0){
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
            "amountRangeFrom": amountRangeFrom
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
            periodType: chartSlab.periodType.id,
            fromPeriod: chartSlab.fromPeriod,
            toPeriod: chartSlab.toPeriod,
            amountRangeFrom: chartSlab.amountRangeFrom,
            amountRangeTo: chartSlab.amountRangeTo,
            annualInterestRate: chartSlab.annualInterestRate,
            locale: scope.optlang.code
          }

          //remove empty values
          _.each(newChartSlabData, function (v, k) {
            if (!v)
              delete newChartSlabData[k];
          });

          return newChartSlabData;
        }

        removeEmptyValues = function (objArray){
          _.each(objArray, function (v, k) {
            //alert(k + ':' + v);
            if (_.isNull(v) || _.isUndefined(v) || v === ''){
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
    }
  });
  mifosX.ng.application.controller('EditRecurringDepositAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditRecurringDepositAccountController]).run(function($log) {
    $log.info("EditRecurringDepositAccountController initialized");
  });
}(mifosX.controllers || {}));
