(function (module) {
    mifosX.controllers = _.extend(module, {
        DataTableController: function (scope, resourceFactory, location) {
            scope.routeTo = function (id) {
                location.path('/viewdatatable/' + id);
            };

            if (!scope.searchCriteria.datatables) {
                scope.searchCriteria.datatables = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.datatables || '';

            scope.onFilter = function () {
                scope.searchCriteria.datatables = scope.filterText;
                scope.saveSC();
            };

            scope.DataTablesPerPage = 15;
            resourceFactory.DataTablesResource.getAllDataTables(function (data) {
                scope.datatables = data;
            });
        }
    });
    mifosX.ng.application.controller('DataTableController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.DataTableController]).run(function ($log) {
        $log.info("DataTableController initialized");
    });
}(mifosX.controllers || {}));