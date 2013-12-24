(function(module) {
  mifosX.controllers = _.extend(module, {
    DataTableController: function(scope, resourceFactory,location) {
        scope.routeTo = function(id){
            location.path('/viewdatatable/' + id);
        };
        resourceFactory.DataTablesResource.getAllDataTables(function(data) {
            scope.datatables = data;
        });

    }
  });
  mifosX.ng.application.controller('DataTableController', ['$scope', 'ResourceFactory','$location', mifosX.controllers.DataTableController]).run(function($log) {
    $log.info("DataTableController initialized");
  });
}(mifosX.controllers || {}));
