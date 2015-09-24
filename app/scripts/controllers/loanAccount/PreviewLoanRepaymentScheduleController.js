(function (module) {
    mifosX.controllers = _.extend(module, {
        PreviewLoanRepaymentScheduleController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.requestId = routeParams.requestId;
            scope.loanId = routeParams.loanId;
            scope.data = {};

            resourceFactory.loanRescheduleResource.preview({scheduleId:scope.requestId}, function (data) {
                scope.data = data;
            });
            scope.reject = function(){
                location.path('/loans/' + scope.loanId + '/rejectreschedulerequest/'+scope.requestId);
            };
            scope.approve = function(){
                location.path('/loans/' + scope.loanId + '/approvereschedulerequest/'+scope.requestId);
            };

            scope.back = function () {
                location.path('/loans/' + scope.loanId + '/viewreschedulerequest/'+scope.requestId);
            };
        }
    });
    mifosX.ng.application.controller('PreviewLoanRepaymentScheduleController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.PreviewLoanRepaymentScheduleController]).run(function ($log) {
        $log.info("PreviewLoanRepaymentScheduleController initialized");
    });
}(mifosX.controllers || {}));