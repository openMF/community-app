(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCashierForTellerController: function (scope, routeParams, route, location, dateFilter, resourceFactory) {

            var requestParams = {};
            scope.formData = {};
            scope.formData.isFullDay = true;
            scope.tellerId = routeParams.tellerId;
            if (routeParams.tellerId) {
                requestParams.tellerId = routeParams.tellerId;
            }

            resourceFactory.tellerCashierTemplateResource.get({tellerId: routeParams.tellerId}, function (data) {
                scope.cashier = data;
            });

            scope.setChoice = function () {
                if (this.formData.isFullDay) {
                    scope.choice = 1;
                }
                else if (!this.formData.isFullDay) {
                    scope.choice = 0;
                }
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                var reqDate = dateFilter(scope.first.date, scope.df);
                var endDate = dateFilter(scope.formData.endDate, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.startDate = reqDate;
                this.formData.endDate = endDate;
                this.formData.hourStartTime;
                this.formData.minStartTime;
                this.formData.hourEndTime;
                this.formData.minEndTime;
                resourceFactory.tellerCashierResource.save(
                    {'tellerId': routeParams.tellerId, 'cashierId': routeParams.cashierId}, 
                    this.formData, function (data) {
                        location.path('tellers/' + routeParams.tellerId + '/cashiers');
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateCashierForTellerController', ['$scope', '$routeParams', '$route', '$location', 'dateFilter', 'ResourceFactory', mifosX.controllers.CreateCashierForTellerController]).run(function ($log) {
        $log.info("CreateCashierForTellerController initialized");
    });
}(mifosX.controllers || {}));
