(function(module) {
  mifosX.controllers = _.extend(module, {
    MakeDataTableEntryController: function(scope, location, routeParams, resourceFactory) {
      scope.tableName = routeParams.tableName;
      scope.entityId = routeParams.entityId;
      scope.columnHeaders = [];
      scope.formData = {};

      resourceFactory.DataTablesResource.getTableDetails({ datatablename:scope.tableName, entityId:scope.entityId, genericResultSet:'true' },function(data) {

        var colName = data.columnHeaders[0].columnName;
        if(colName == 'id') { data.columnHeaders.splice(0,1); }

        colName = data.columnHeaders[0].columnName;
        if(colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
          data.columnHeaders.splice(0,1);
          scope.isCenter = colName ==  'center_id' ? true : false;
        }
        scope.columnHeaders = data.columnHeaders;
      });

      scope.submit = function () {
        var params = {datatablename:scope.tableName, entityId:scope.entityId, genericResultSet: 'true'};
        this.formData.locale = 'en';
        this.formData.dateFormat =  'dd MMMM yyyy';
        resourceFactory.DataTablesResource.save(params, this.formData, function(data){
          var destination = "";
          if ( data.loanId) {
            destination = '/viewloanaccount/'+data.loanId;
          } else if ( data.savingsId) {
            destination = '/viewsavingaccount/' + data.savingsId;
          } else if ( data.clientId) {
            destination = '/viewclient/'+data.clientId;
          } else if ( data.groupId) {
              if (scope.isCenter) {
                  destination = '/viewcenter/'+data.groupId;
              } else {
                  destination = '/viewgroup/'+data.groupId;
              }
          } else if ( data.officeId) {
            destination = '/viewoffice/'+data.officeId;
          }
          location.path(destination);
        });
      };

    }
  });
  mifosX.ng.application.controller('MakeDataTableEntryController', ['$scope', '$location', '$routeParams', 'ResourceFactory', mifosX.controllers.MakeDataTableEntryController]).run(function($log) {
    $log.info("MakeDataTableEntryController initialized");
  });
}(mifosX.controllers || {}));
