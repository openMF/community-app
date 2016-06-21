(function (module) {
    mifosX.controllers = _.extend(module, {
        AddNewSavingsChargeController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.offices = [];
            scope.cancelRoute = routeParams.id;
            scope.date = {};

            resourceFactory.savingsChargeResource.get({accountId: routeParams.id, resourceType: 'template'}, function (data) {
                scope.chargeOptions = data.chargeOptions;
            });

            scope.chargeSelected = function (id) {
                resourceFactory.chargeResource.get({chargeId: id, template: 'true'}, function (data) {
                    scope.chargeCalculationType = data.chargeCalculationType.id;
                    scope.chargeTimeType = data.chargeTimeType.id;
                    scope.chargeDetails = data;
                    scope.formData.amount = data.amount;
                    if(data.chargeTimeType.value === "Withdrawal Fee"
                        || data.chargeTimeType.value === "Saving No Activity Fee"){
                        scope.dueDateNotRequired = true;
                    }
                    scope.formData.feeInterval = data.feeInterval;
                    if (data.chargeTimeType.value === "Annual Fee" || data.chargeTimeType.value === "Monthly Fee") {
                        scope.chargeTimeTypeAnnualOrMonth = true;
                    }
                });
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                if (scope.dueDateNotRequired !== true) {
                    if (scope.chargeTimeTypeAnnualOrMonth === true) {
                        this.formData.monthDayFormat = "dd MMMM";
                        if (scope.date.due) {
                            this.formData.feeOnMonthDay = dateFilter(scope.date.due, 'dd MMMM');
                        } else {
                            this.formData.feeOnMonthDay = "";
                        }
                    } else {
                        this.formData.dateFormat = scope.df;
                        if (scope.date.specificduedate) {
                            this.formData.dueDate = dateFilter(scope.date.specificduedate, scope.df);
                        } else {
                            this.formData.dueDate = "";
                        }
                    }
                }
                resourceFactory.savingsChargeResource.save({accountId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewsavingaccount/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('AddNewSavingsChargeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.AddNewSavingsChargeController]).run(function ($log) {
        $log.info("AddNewSavingsChargeController initialized");
    });
}(mifosX.controllers || {}));
