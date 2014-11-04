(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewRescheduleRequestController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.requestId = routeParams.requestId;
            scope.loanId = routeParams.loanId;

            resourceFactory.loanRescheduleResource.get({requestId:scope.requestId}, function (data) {
                scope.loanrescheduledetails = data;
                scope.rescheduleFromDate = new Date(scope.loanrescheduledetails.rescheduleFromDate);
                scope.rescheduleFromDate = dateFilter(scope.rescheduleFromDate,"dd MMMM yyyy");
                if(scope.loanrescheduledetails.adjustedDueDate != null)
                if(scope.loanrescheduledetails.adjustedDueDate != null)
                {
                    scope.loanrescheduledetails.adjustedDueDate = new Date(scope.loanrescheduledetails.adjustedDueDate);
                    scope.loanrescheduledetails.adjustedDueDate = dateFilter(scope.loanrescheduledetails.adjustedDueDate,"dd MMMM yyyy");
                    scope.changeRepaymentDate = true;
                }
                if(scope.loanrescheduledetails.graceOnPrincipal != null || scope.loanrescheduledetails.graceOnInterest != null)
                {
                    scope.introduceGracePeriods = true;
                }
                if(scope.loanrescheduledetails.extraTerms != null){
                    scope.extendRepaymentPeriod = true;
                }
                if(scope.loanrescheduledetails.interestRate != null){
                    scope.adjustinterestrates = true;
                }
            });

            scope.reject = function(){
                location.path('/rejectloanreschedule/' + scope.loanId + '/' + scope.requestId);
            };
            scope.approve = function(){
                location.path('/approveloanreschedule/' + scope.loanId +'/'+ scope.requestId);
            };

            scope.cancel = function () {
                location.path('/rescheduleloans/' + scope.loanId);
            };

            scope.submit = function () {
                location.path('/previewloanrepaymentschedule/' + scope.loanId +'/'+ scope.requestId);
            };

        }
    });
    mifosX.ng.application.controller('ViewRescheduleRequestController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.ViewRescheduleRequestController]).run(function ($log) {
        $log.info("ViewRescheduleRequestController initialized");
    });
}(mifosX.controllers || {}));