(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewRescheduleRequestController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.requestId = routeParams.requestId;
            scope.loanId = routeParams.loanId;

            resourceFactory.loanRescheduleResource.get({scheduleId:scope.requestId}, function (data) {
                scope.loanRescheduleDetails = data;
                scope.loanTermVariationsData = data.loanTermVariationsData;
                scope.rescheduleFromDate = new Date(scope.loanRescheduleDetails.rescheduleFromDate);
                scope.rescheduleFromDate = dateFilter(scope.rescheduleFromDate,"dd MMMM yyyy");
                scope.submittedOnDate = new Date(scope.loanRescheduleDetails.timeline.submittedOnDate);
                scope.submittedOnDate = dateFilter(scope.submittedOnDate,"dd MMMM yyyy");

                for(var i in scope.loanTermVariationsData) {
                    if(scope.loanTermVariationsData[i].termType.value == "dueDate") {
                        scope.loanRescheduleDetails.adjustedDueDate = new Date(scope.loanTermVariationsData[i].dateValue);
                        scope.loanRescheduleDetails.adjustedDueDate = dateFilter(scope.loanTermVariationsData[i].dateValue,"dd MMMM yyyy");
                        scope.changeRepaymentDate = true;
                    }

                    if(scope.loanTermVariationsData[i].termType.value == "graceOnPrincipal") {
                        scope.loanRescheduleDetails.graceOnPrincipal = scope.loanTermVariationsData[i].decimalValue;
                        scope.introduceGracePeriods = true;
                    }

                    if(scope.loanTermVariationsData[i].termType.value == "graceOnInterest") {
                        scope.loanRescheduleDetails.graceOnInterest = scope.loanTermVariationsData[i].decimalValue;
                        scope.introduceGracePeriods = true;
                    }

                    if(scope.loanTermVariationsData[i].termType.value == "extendRepaymentPeriod") {
                        scope.loanRescheduleDetails.extraTerms = scope.loanTermVariationsData[i].decimalValue;
                        scope.extendRepaymentPeriod = true;
                    }

                    if(scope.loanTermVariationsData[i].termType.value == "interestRateForInstallment") {
                        scope.loanRescheduleDetails.interestRate = scope.loanTermVariationsData[i].decimalValue;
                        scope.adjustinterestrates = true;
                    }

                }
            });

            scope.reject = function(){
                location.path('/loans/' + scope.loanId + '/rejectreschedulerequest/'+scope.requestId);
            };
            scope.approve = function(){
                location.path('/loans/' + scope.loanId + '/approvereschedulerequest/'+scope.requestId);
            };

            scope.cancel = function () {
                location.path('/loans/' + scope.loanId + '/reschedule/');
            };

            scope.submit = function () {
                location.path('/loans/' + scope.loanId + '/previewloanrepaymentschedule/'+scope.requestId);
            };

        }
    });
    mifosX.ng.application.controller('ViewRescheduleRequestController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.ViewRescheduleRequestController]).run(function ($log) {
        $log.info("ViewRescheduleRequestController initialized");
    });
}(mifosX.controllers || {}));