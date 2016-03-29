(function (module) {
    mifosX.controllers = _.extend(module, {
        EditTaxComponentController: function (scope, resourceFactory,routeParams, location, dateFilter) {

            scope.start = {};
            scope.start.date = new Date();
            scope.restrictDate = new Date('2025-06-22');
            scope.formData = {};
            resourceFactory.taxcomponent.get({taxComponentId: routeParams.taxComponentId, template: 'true'},function (data) {
                scope.taxComponent = data;
                if (data.startDate) {
                    scope.start.date = new Date(data.startDate);
                }
                scope.formData = {
                    name: scope.taxComponent.name,
                    percentage: scope.taxComponent.percentage
                }
            });


            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                var reqDate = dateFilter(scope.start.date, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.startDate = reqDate;
                resourceFactory.taxcomponent.put({taxComponentId: routeParams.taxComponentId},this.formData, function (data) {
                    location.path('/viewtaxcomponent/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditTaxComponentController', ['$scope', 'ResourceFactory','$routeParams', '$location', 'dateFilter', mifosX.controllers.EditTaxComponentController]).run(function ($log) {
        $log.info("EditTaxComponentController initialized");
    });
}(mifosX.controllers || {}));
