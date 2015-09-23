(function (module) {
    mifosX.controllers = _.extend(module, {
        PayClientChargeController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.cancelRoute = routeParams.id;
            scope.formData = {};
            scope.paymentDate = new Date();

            resourceFactory.clientChargesResource.get({clientId: routeParams.id, resourceType: routeParams.chargeid}, function (data) {
                scope.formData.amount = data.amountOutstanding;
            });

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (scope.paymentDate) {
                    this.formData.transactionDate = dateFilter(scope.paymentDate, scope.df);
                }
                resourceFactory.clientChargesResource.save({clientId: routeParams.id , resourceType: routeParams.chargeid ,command: 'paycharge'}, this.formData, function (data) {
                    location.path('/viewclient/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('PayClientChargeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.PayClientChargeController]).run(function ($log) {
        $log.info("PayClientChargeController initialized");
    });
}(mifosX.controllers || {}));
