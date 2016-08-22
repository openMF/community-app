(function (module) {
    mifosX.controllers = _.extend(module, {
        GLIMLoanAccountWaiveChargeController: function (scope, resourceFactory, location, routeParams, dateFilter) {

            scope.loanId = routeParams.loanId;
            scope.loanChargeId = routeParams.chargeId;
            scope.formData = {};
            scope.formData.locale = scope.optlang.code;
            scope.formData.dateFormat = scope.df;

            resourceFactory.glimTransactionTemplateResource.get({loanId: scope.loanId , command:"waivecharge"}, function (data) {
                scope.formData.transactionAmount = data.transactionAmount;
                scope.formData.clientMembers = data.clientMembers;
            });

            scope.getTransactionAmount = function(data){
                var amount = 0;
                for (var i=0; i<data.length; i++) {
                    if(angular.isDefined(data[i].transactionAmount) && data[i].isClientSelected){
                        amount= amount + parseFloat(data[i].transactionAmount);
                    }
                }
                this.formData.transactionAmount = amount;
            };

            scope.cancel = function(){
                location.path('/viewloanaccount/' + scope.loanId);
            };


            scope.submit = function(){
                resourceFactory.glimTransactionResource.save({loanId: scope.loanId, command: 'waivecharge'}, this.formData, function (data) {
                    location.path('/viewloanaccount/' + scope.loanId);
                });
            }

        }
    });
    mifosX.ng.application.controller('GLIMLoanAccountWaiveChargeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.GLIMLoanAccountWaiveChargeController]).run(function ($log) {
        $log.info("GLIMLoanAccountWaiveChargeController initialized");
    });
}(mifosX.controllers || {}));

