(function (module) {
    mifosX.controllers = _.extend(module, {
        EditTellerController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.tellerStatuses = [ {"id":300, "code":"300", "value":"Active"}, {"id":400, "code":"400", "value":"Inactive"}];

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            resourceFactory.tellerResource.get({tellerId: routeParams.id, template: 'true'}, function (data) {
                scope.tellerId = data.id;
                scope.officeName = data.officeName;
                if (data.endDate) {
                    var editEndDate = dateFilter(data.endDate, scope.df);
                    data.endDate = new Date(editEndDate);
                }
                if (data.startDate) {
                    var editStartDate = dateFilter(data.startDate, scope.df);
                    data.startDate = new Date(editStartDate);
                }
                if (data.status) {
                    if (data.status == 'ACTIVE') {
                        data.status = 300;
                    } else {
                        data.status = 400;
                    }
                }
                scope.formData = {
                    name: data.name,
                    officeId: data.officeId,
                    description: data.description,
                    status: data.status,
                    endDate: data.endDate,
                    startDate: data.startDate
                }
            });


            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                var reqDate = dateFilter(scope.formData.startDate, scope.df);
                var endDate = dateFilter(scope.formData.endDate, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.startDate = reqDate;
                this.formData.endDate = endDate;
                resourceFactory.tellerResource.update({'tellerId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewtellers/' + data.resourceId);

                });
            };
        }
    });
    mifosX.ng.application.controller('EditTellerController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditTellerController]).run(function ($log) {
        $log.info("EditTellerController initialized");
    });
}(mifosX.controllers || {}));
