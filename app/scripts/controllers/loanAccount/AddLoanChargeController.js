(function (module) {
    mifosX.controllers = _.extend(module, {
        AddLoanChargeController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.charges = [];
            scope.formData = {};
            scope.isCollapsed = true;
            scope.loanId = routeParams.id;
            scope.first = {};
            scope.first.date = new Date();
            resourceFactory.loanChargeTemplateResource.get({loanId: scope.loanId}, function (data) {
                scope.charges = data.chargeOptions;
            });

            scope.selectCharge = function(chargeId){
                for(var i in scope.charges){
                    if(scope.charges[i].id == chargeId){
                        scope.isCollapsed = false;
                        scope.chargeData = scope.charges[i];
                        scope.formData.amount = scope.charges[i].amount;
                    }
                }
            };

            scope.cancel = function () {
                location.path('/viewloanaccount/' + scope.loanId);
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if(scope.chargeData.chargeTimeType.id==2){
                    this.formData.dueDate = dateFilter(this.first.date, scope.df);
                }
                resourceFactory.loanResource.save({resourceType: 'charges', loanId: scope.loanId}, this.formData, function (data) {
                    location.path('/viewloanaccount/' + data.loanId);
                });
            };

        }
    });
    mifosX.ng.application.controller('AddLoanChargeController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.AddLoanChargeController]).run(function ($log) {
        $log.info("AddLoanChargeController initialized");
    });
}(mifosX.controllers || {}));
