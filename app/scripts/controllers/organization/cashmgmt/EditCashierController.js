(function (module) {
    mifosX.controllers = _.extend(module, {
        EditCashierController: function (scope, routeParams, resourceFactory, location, dateFilter) {

            scope.formData = {};
            scope.cashierOption = [];
            resourceFactory.tellerCashierResource.getCashier({tellerId: routeParams.tellerId, cashierId:routeParams.id}, function (data) {
                scope.cashier = data;
                var startTime = scope.cashier.startTime;
                var endTime = scope.cashier.endTime;

                scope.formData.description= scope.cashier.description;
                scope.formData.startDate = scope.cashier.startDate;
                scope.formData.endDate = scope.cashier.endDate;
                var startDate = dateFilter(scope.cashier.startDate, scope.df);
                scope.formData.startDate  = new Date(startDate);
                var endDate = dateFilter(scope.cashier.endDate, scope.df);
                scope.formData.endDate  = new Date(endDate);
                scope.formData.staffId = scope.cashier.staffId;
                scope.formData.isFullDay = scope.cashier.isFullDay;
                if(!scope.formData.isFullDay) {
                    var startTime = scope.cashier.startTime;
                    var endTime = scope.cashier.endTime;
                    var timeStampForStartTime = startTime.split(":");
                    var timeStampForEndTime = endTime.split(":");
                    scope.formData.hourStartTime = Number(timeStampForStartTime[0]);
                    scope.formData.minStartTime = Number(timeStampForStartTime[1]);
                    scope.formData.hourEndTime = Number(timeStampForEndTime[0]);
                    scope.formData.minEndTime = Number(timeStampForEndTime[1]);
                }

            });

            scope.setChoice = function () {
                if (this.formData.isFullDay) {
                    scope.choice = 1;
                }
                else if (!this.formData.isFullDay) {
                    scope.choice = 0;

                }
            };

            resourceFactory.tellerCashierTemplateResource.get({tellerId: routeParams.tellerId}, function (data) {
                scope.office= data.officeName;
                scope.staffs = data.staffOptions;
                /*scope.formData.staffId = scope.staffs.id;*/
            });

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                var reqDate = dateFilter(scope.formData.startDate, scope.df);
                var endDate = dateFilter(scope.formData.endDate, scope.df);
                this.formData.staffId;
                this.formData.dateFormat = scope.df;
                this.formData.startDate = reqDate;
                this.formData.endDate = endDate;
                resourceFactory.tellerCashierResource.update({'tellerId': routeParams.tellerId,'cashierId':routeParams.id}, this.formData, function (data) {
                    location.path('/tellers/' + scope.cashier.tellerId+'/cashiers');

                });
            };
        }
    });
    mifosX.ng.application.controller('EditCashierController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditCashierController]).run(function ($log) {
        $log.info("EditCashierController initialized");
    });
}(mifosX.controllers || {}));
