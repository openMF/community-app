(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewGlimRepaymentScheduleController: function (scope, resourceFactory, location, routeParams, $rootScope) {

            scope.glimId = routeParams.glimId;
            scope.loanId = $rootScope.loanId;
            scope.clientId = $rootScope.clientId;
            scope.clientName = $rootScope.clientName;
            scope.disbursedAmount = $rootScope.principalAmount;
            scope.disbursedDate = $rootScope.disbursementDate;
            scope.glimrepaymentSchedule = {};

            resourceFactory.glimRepaymentScheduleResource.getRepaymentScheduleById({glimId: scope.glimId, 'disbursedAmount': scope.disbursedAmount,
                'disbursedDate': scope.disbursedDate }, function (data) {
                scope.glimrepaymentSchedule = data.periodsWithDisbursement;
            });

            scope.cancel = function(){
                location.path('/viewloanaccount/' + scope.loanId);
            };

        }
    });
    mifosX.ng.application.controller('ViewGlimRepaymentScheduleController', ['$scope', 'ResourceFactory', '$location', '$routeParams', '$rootScope', mifosX.controllers.ViewGlimRepaymentScheduleController]).run(function ($log) {
        $log.info("ViewGlimRepaymentScheduleController initialized");
    });
}(mifosX.controllers || {}));
