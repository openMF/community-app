(function (module) {
    mifosX.controllers = _.extend(module, {
        EditHolidayController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.formData = {};
            scope.date = {};
            scope.restrictDate = new Date();
            scope.specificRescheduleType = 2;

            resourceFactory.holValueResource.getholvalues({holId: routeParams.id}, function (data) {
                scope.holiday = data;
                 resourceFactory.holidayTemplateResource.get(function(repaymentSchedulingRulesData){
                    scope.repaymentSchedulingRules = repaymentSchedulingRulesData;
                    for(var i in scope.repaymentSchedulingRules){
                        if(scope.repaymentSchedulingRules[i].id == data.reschedulingType){
                            scope.reschedulingType = scope.repaymentSchedulingRules[i]; 
                        }
                    }
                    
                });
                scope.formData = {
                    name: data.name,
                    description: data.description,
                };
                scope.formData.reschedulingType = data.reschedulingType;

                scope.holidayStatusActive = false;
                if (data.status.value === "Active") {
                    scope.holidayStatusActive = true;
                }

                var fromDate = dateFilter(data.fromDate, scope.df);
                scope.date.fromDate = new Date(fromDate);

                var toDate = dateFilter(data.toDate, scope.df);
                scope.date.toDate = new Date(toDate);

                if(data.reschedulingType == scope.specificRescheduleType){
                    var repaymentsRescheduledTo = dateFilter(data.repaymentsRescheduledTo, scope.df);
                    scope.date.repaymentsRescheduledTo = new Date(repaymentsRescheduledTo);
                }  

            });

            scope.selectRescheduleType = function(data){
                if(data && data.id == scope.specificRescheduleType){
                    scope.date.repaymentsRescheduledTo = new Date();
                }else{
                    scope.date.repaymentsRescheduledTo = undefined;
                }
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (!scope.holidayStatusActive) {
                    this.formData.fromDate = dateFilter(scope.date.fromDate, scope.df);
                    this.formData.toDate = dateFilter(scope.date.toDate, scope.df);
                }

                if(scope.reschedulingType.id == scope.specificRescheduleType){
                    this.formData.repaymentsRescheduledTo = dateFilter(scope.date.repaymentsRescheduledTo, scope.df);
                }
                var rescheduleId = scope.reschedulingType.id
                this.formData.reschedulingType = rescheduleId;

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
