(function (module) {
    mifosX.controllers = _.extend(module, {
        EditHolidayController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.formData = {};
            scope.date = {};
            scope.restrictDate = new Date();
            scope.isRepayRescheduleToRequired = true;

            scope.isRepayRescheduleTypeScheduleOnlyOnDate = function(){
                scope.isRepayRescheduleToRequired = false;
                if(scope.repaymentSchedulingRuleType && scope.repaymentSchedulingRuleType.value == 'Reschedule to specified date'){
                    scope.isRepayRescheduleToRequired = true;
                }
                return scope.isRepayRescheduleToRequired;
            };

            resourceFactory.holValueResource.getholvalues({holId: routeParams.id}, function (data) {

                scope.holiday = data;

                resourceFactory.holidayTemplateResource.get(function(repaymentSchedulingRulesData){
                    scope.repaymentSchedulingRules = repaymentSchedulingRulesData;

                    angular.forEach(scope.repaymentSchedulingRules, function(repaymentSchedulingRule) {
                        if(repaymentSchedulingRule.value == 'SCHEDULEONLYONDATE'){
                            repaymentSchedulingRule.value = 'Reschedule to specified date';
                        }else if(repaymentSchedulingRule.value == 'EXTENDREPAYMENTSCHEDULE'){
                            repaymentSchedulingRule.value = 'Give Repayment Holiday';
                        }
                    });

                    if(scope.holiday.isExtendRepaymentReschedule == 1){
                        angular.forEach(scope.repaymentSchedulingRules, function(repaymentSchedulingRule) {
                            if(repaymentSchedulingRule.value == 'Give Repayment Holiday'){
                                scope.repaymentSchedulingRuleType = repaymentSchedulingRule;
                                scope.isRepayRescheduleToRequired = false;
                            }
                        });
                    }else{
                        angular.forEach(scope.repaymentSchedulingRules, function(repaymentSchedulingRule) {
                            if(repaymentSchedulingRule.value == 'Reschedule to specified date'){
                                scope.repaymentSchedulingRuleType = repaymentSchedulingRule;
                            }
                        });
                    }
                });

                scope.renameRepaymentScheduleingRuleValue = function(){

                }

                scope.formData = {
                    name: data.name,
                    description: data.description
                };

                scope.holidayStatusActive = false;
                if (data.status.value === "Active") {
                    scope.holidayStatusActive = true;
                }

                var fromDate = dateFilter(data.fromDate, scope.df);
                scope.date.fromDate = new Date(fromDate);

                var toDate = dateFilter(data.toDate, scope.df);
                scope.date.toDate = new Date(toDate);

                var repaymentsRescheduledTo;
                if(data.repaymentsRescheduledTo){
                    repaymentsRescheduledTo = dateFilter(data.repaymentsRescheduledTo, scope.df);
                }else{
                    repaymentsRescheduledTo = new Date();
                }
                scope.date.repaymentsRescheduledTo = new Date(repaymentsRescheduledTo);

            });

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (!scope.holidayStatusActive) {
                    this.formData.fromDate = dateFilter(scope.date.fromDate, scope.df);
                    this.formData.toDate = dateFilter(scope.date.toDate, scope.df);
                }
                if(scope.repaymentSchedulingRuleType && scope.repaymentSchedulingRuleType.value == 'Reschedule to specified date'){
                    this.formData.repaymentsRescheduledTo = dateFilter(scope.date.repaymentsRescheduledTo, scope.df);
                    this.formData.extendRepaymentReschedule = false;
                }else{
                    delete this.formData.repaymentsRescheduledTo;
                    this.formData.extendRepaymentReschedule = true;
                }
                resourceFactory.holValueResource.update({holId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewholiday/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditHolidayController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditHolidayController]).run(function ($log) {
        $log.info("EditHolidayController initialized");
    });
}(mifosX.controllers || {}));
