(function (module) {
    mifosX.controllers = _.extend(module, {
        EditLoanChargeController: function (scope, resourceFactory, routeParams, location) {

            scope.loanId = routeParams.loanId;
            scope.chargeId = routeParams.id;
            resourceFactory.loanResource.get({ resourceType: 'charges', loanId: scope.loanId, resourceId: scope.chargeId, template: true }, function (data) {
                scope.formData = {amount: data.amount};
            });

            scope.cancel = function () {
                location.path('/viewloanaccount/' + scope.loanId);
            };


            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                resourceFactory.loanResource.put({resourceType: 'charges', resourceId: scope.chargeId, loanId: scope.loanId}, this.formData, function (data) {
                    location.path('/viewloanaccount/' + data.loanId);
                });
            };

        }
    });
    mifosX.ng.application.controller('EditLoanChargeController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.EditLoanChargeController]).run(function ($log) {
        $log.info("EditLoanChargeController initialized");
    });
}(mifosX.controllers || {}));
