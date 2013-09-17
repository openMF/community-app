(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewDataTableController: function(scope, routeParams , resourceFactory ) {
        resourceFactory.DataTablesResource.getTableDetails({datatablename: routeParams.tableName} , function(data) {
          
          var temp=[];
          if(data.columnHeaderData[0].columnName == "id") {
            data.columnHeaderData.splice(0,1);
          }
          if(data.columnHeaderData[0].columnName == "client_id") {
            data.columnHeaderData.splice(0,1);
          }

          for(var i=0; i< data.columnHeaderData.length; i++) {
            if(data.columnHeaderData[i].columnName.indexOf("_cd_") > 0) {
              temp = data.columnHeaderData[i].columnName.split("_cd_");
              data.columnHeaderData[i].columnName = temp[1];
              data.columnHeaderData[i].code = temp[0];
            }
          }
            scope.datatable = data;
        });
    }
  });
  mifosX.ng.application.controller('ViewDataTableController', ['$scope', '$routeParams','ResourceFactory', mifosX.controllers.ViewDataTableController]).run(function($log) {
    $log.info("ViewDataTableController initialized");
  });
}(mifosX.controllers || {}));
