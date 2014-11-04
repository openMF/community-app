(function (module) {
    mifosX.controllers = _.extend(module, {
        PreviewLoanRepaymentScheduleController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.requestId = routeParams.requestId;
            scope.loanId = routeParams.loanId;
            scope.data = {};

            resourceFactory.loanRescheduleResource.preview({requestId:scope.requestId}, function (data) {
                console.log("preview data",data);
                scope.data = data;
            });
            scope.reject = function(){
                location.path('/rejectloanreschedule/' + scope.loanId + '/' + scope.requestId);
            };
            scope.approve = function(){
                location.path('/approveloanreschedule/' + scope.loanId +'/'+ scope.requestId);
            };

            scope.back = function () {
                location.path('/viewreschedulerequest/' + scope.loanId + '/' + scope.requestId);
            };
        }
    });
    mifosX.ng.application.controller('PreviewLoanRepaymentScheduleController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.PreviewLoanRepaymentScheduleController]).run(function ($log) {
        $log.info("PreviewLoanRepaymentScheduleController initialized");
    });
}(mifosX.controllers || {}));