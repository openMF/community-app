(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewRescheduleRequestController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.requestId = routeParams.requestId;
            scope.loanId = routeParams.loanId;

            resourceFactory.loanRescheduleResource.get({scheduleId:scope.requestId}, function (data) {
                scope.loanRescheduleDetails = data;
                scope.rescheduleFromDate = new Date(scope.loanRescheduleDetails.rescheduleFromDate);
                scope.rescheduleFromDate = dateFilter(scope.rescheduleFromDate,"dd MMMM yyyy");
                scope.submittedOnDate = new Date(scope.loanRescheduleDetails.timeline.submittedOnDate);
                scope.submittedOnDate = dateFilter(scope.submittedOnDate,"dd MMMM yyyy");
                if(scope.loanRescheduleDetails.adjustedDueDate != null)
                if(scope.loanRescheduleDetails.adjustedDueDate != null)
                {
                    scope.loanRescheduleDetails.adjustedDueDate = new Date(scope.loanRescheduleDetails.adjustedDueDate);
                    scope.loanRescheduleDetails.adjustedDueDate = dateFilter(scope.loanRescheduleDetails.adjustedDueDate,"dd MMMM yyyy");
                    scope.changeRepaymentDate = true;
                }
                if(scope.loanRescheduleDetails.graceOnPrincipal != null || scope.loanRescheduleDetails.graceOnInterest != null)
                {
                    scope.introduceGracePeriods = true;
                }
                if(scope.loanRescheduleDetails.extraTerms != null){
                    scope.extendRepaymentPeriod = true;
                }
                if(scope.loanRescheduleDetails.interestRate != null){
                    scope.adjustinterestrates = true;
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