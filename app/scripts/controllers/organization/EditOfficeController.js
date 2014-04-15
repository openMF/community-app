(function (module) {
    mifosX.controllers = _.extend(module, {
        EditOfficeController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.formData = {};
            scope.first = {};
            scope.restrictDate = new Date();
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.parentId = data[0].id;
            });
            resourceFactory.officeResource.get({officeId: routeParams.id, template: 'true'}, function (data) {
                scope.offices = data.allowedParents;
                scope.id = data.id;
                if (data.openingDate) {
                    var editDate = dateFilter(data.openingDate, scope.df);
                    scope.first.date = new Date(editDate);
                }
                scope.formData =
                {
                    name: data.name,
                    externalId: data.externalId,
                    parentId: data.parentId
                }
            });

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.openingDate = reqDate;
                resourceFactory.officeResource.update({'officeId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewoffice/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditOfficeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditOfficeController]).run(function ($log) {
        $log.info("EditOfficeController initialized");
    });
}(mifosX.controllers || {}));
