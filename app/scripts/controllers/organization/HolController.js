(function (module) {
    mifosX.controllers = _.extend(module, {
        HolController: function (scope, resourceFactory, location) {
            scope.holidays = [];
            scope.offices = [];
            scope.formData = {};

            scope.routeTo = function (id) {
                location.path('/viewholiday/' + id);
            };

            if (!scope.searchCriteria.holidays) {
                scope.searchCriteria.holidays = [null, null];
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.holidays[0] || '';
            scope.formData.officeId = scope.searchCriteria.holidays[1];

            scope.onFilter = function () {
                scope.searchCriteria.holidays[0] = scope.filterText;
                scope.saveSC();
            };

            scope.HolidaysPerPage =15;

            resourceFactory.holResource.getAllHols({officeId: scope.formData.officeId}, function (data) {
                scope.holidays = data;
            });

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            scope.getHolidays = function () {
                scope.searchCriteria.holidays[1] = scope.formData.officeId;
                scope.saveSC();
                resourceFactory.holResource.getAllHols({officeId: scope.formData.officeId}, function (data) {
                    scope.holidays = data;
                });
            };
        }
    });
    mifosX.ng.application.controller('HolController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.HolController]).run(function ($log) {
        $log.info("HolController initialized");
    });
}(mifosX.controllers || {}));