(function (module) {
    mifosX.controllers = _.extend(module, {
        RejectLoanRescheduleRequestController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.formData = {};
            scope.loanId = routeParams.loanId;
            scope.requestId = routeParams.requestId;

            scope.cancel = function () {
                location.path('/viewreschedulerequest/' + scope.loanId + '/' + scope.requestId);
            };
            scope.reject = function(){
                this.formData.dateFormat = scope.df;
                this.formData.locale = scope.optlang.code;
                this.formData.rejectedOnDate = dateFilter(this.formData.rejectedOnDate, scope.df);

                resourceFactory.loanRescheduleResource.reject({requestId:scope.requestId},this.formData,function (data) {
                    location.path('/viewloanaccount/' + scope.loanId);
                });
            };
        }
    });
    mifosX.ng.application.controller('RejectLoanRescheduleRequestController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.RejectLoanRescheduleRequestController]).run(function ($log) {
        $log.info("RejectLoanRescheduleRequestController initialized");
    });
}(mifosX.controllers || {}));