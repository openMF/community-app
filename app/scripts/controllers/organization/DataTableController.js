(function(module) {
  mifosX.controllers = _.extend(module, {
    DataTableController: function(scope, resourceFactory) {

        resourceFactory.DataTablesResource.getAllDataTables(function(data) {
            scope.datatables = data;
        });

    }
  });
  mifosX.ng.application.controller('DataTableController', ['$scope', 'ResourceFactory', mifosX.controllers.DataTableController]).run(function($log) {
    $log.info("DataTableController initialized");
  });
}(mifosX.controllers || {}));
