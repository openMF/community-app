(function (module) {
    mifosX.controllers = _.extend(module, {
        AddNewClientChargeController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.clientId = routeParams.id;
            scope.offices = [];
            scope.date = {};

            resourceFactory.clientChargesResource.get({clientId: routeParams.id, resourceType: 'template'}, function (data) {
                scope.chargeOptions = data.chargeOptions;
            });

            scope.chargeSelected = function (id) {
                resourceFactory.chargeResource.get({chargeId: id, template: 'true'}, function (data) {
                    scope.chargeCalculationType = data.chargeCalculationType.id;
                    scope.chargeTimeType = data.chargeTimeType.id;
                    scope.chargeDetails = data;
                    scope.formData.amount = data.amount;
                });
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (scope.date.specificduedate) {
                    this.formData.dueDate = dateFilter(scope.date.specificduedate, scope.df);
                }
                resourceFactory.clientChargesResource.save({clientId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewclient/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('AddNewClientChargeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.AddNewClientChargeController]).run(function ($log) {
        $log.info("AddNewClientChargeController initialized");
    });
}(mifosX.controllers || {}));
