(function (module) {
    mifosX.controllers = _.extend(module, {
        ReportsController: function (scope, resourceFactory, location) {
            scope.reports = [];

            scope.routeTo = function (id) {
                location.path('/system/viewreport/' + id);
            };

            if (!scope.searchCriteria.manrep) {
                scope.searchCriteria.manrep = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.manrep || '';

            scope.onFilter = function () {
                scope.searchCriteria.manrep = scope.filterText;
                scope.saveSC();
            }

            scope.ReportsPerPage = 15;
            resourceFactory.reportsResource.getReport(function (data) {
                scope.reports = data;
            });
        }
    });
    mifosX.ng.application.controller('ReportsController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ReportsController]).run(function ($log) {
        $log.info("ReportsController initialized");
    });
}(mifosX.controllers || {}));