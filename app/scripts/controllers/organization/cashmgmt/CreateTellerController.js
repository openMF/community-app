(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateTellerController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.tellerStatuses = [ {"id":300, "code":"300", "value":"Active"}, {"id":400, "code":"400", "value":"Inactive"}];
            scope.first = {};
            scope.first.date = new Date();
            scope.restrictDate = new Date();
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData = {
                    officeId: scope.offices[0].id
                }
            });

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                var reqDate = dateFilter(scope.first.date, scope.df);
                var endDate = dateFilter(scope.formData.endDate, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.startDate = reqDate;
                this.formData.endDate = endDate;
                resourceFactory.tellerResource.save(this.formData, function (data) {
                    location.path('/viewtellers/' + data.resourceId);

                });
            };
        }
    });
    mifosX.ng.application.controller('CreateTellerController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateTellerController]).run(function ($log) {
        $log.info("CreateTellerController initialized");
    });
}(mifosX.controllers || {}));
