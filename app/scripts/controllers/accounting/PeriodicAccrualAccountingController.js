
(function (module) {
    mifosX.controllers = _.extend(module, {
        PeriodicAccrualAccountingController: function (scope, resourceFactory, location, translate, routeParams, dateFilter) {
            scope.first = {};
            scope.formData = {};
            scope.accrueTill = new Date();
            scope.restrictDate = new Date();

            scope.submit = function () {
                var reqDate = dateFilter(scope.accrueTill, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.tillDate = reqDate;
                resourceFactory.periodicAccrualAccountingResource.run(this.formData, function (data) {
                    location.path('/accounting');
                });
            }
        }
    });
    mifosX.ng.application.controller('PeriodicAccrualAccountingController', ['$scope', 'ResourceFactory', '$location', '$translate', '$routeParams', 'dateFilter', mifosX.controllers.PeriodicAccrualAccountingController]).run(function ($log) {
        $log.info("PeriodicAccrualAccountingController initialized");
    });
}(mifosX.controllers || {}));
