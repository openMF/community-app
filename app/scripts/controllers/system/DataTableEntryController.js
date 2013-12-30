(function(module) {
  mifosX.controllers = _.extend(module, {
    DataTableEntryController: function(scope, location, routeParams, route, resourceFactory,$modal,dateFilter) {

      scope.tableName = routeParams.tableName;
      scope.entityId = routeParams.entityId;
      scope.resourceId = routeParams.resourceId;
      scope.formDat = {};
      scope.columnHeaders = [];
      scope.formData = {};
      scope.isViewMode = true;

      var reqparams = {datatablename:scope.tableName, entityId:scope.entityId, genericResultSet:'true'};
      if (scope.resourceId) { reqparams.resourceId = scope.resourceId; }

      resourceFactory.DataTablesResource.getTableDetails(reqparams, function(data) {
        for(var i in data.columnHeaders) {
          if (data.columnHeaders[i].columnCode) {
            for (var j in data.columnHeaders[i].columnValues){
              if (data.data[0].row[i] == data.columnHeaders[i].columnValues[j].id) {
                data.columnHeaders[i].value = data.columnHeaders[i].columnValues[j].value;
              }
            }
          } else {
            data.columnHeaders[i].value = data.data[0].row[i];
          }
        }
        scope.columnHeaders = data.columnHeaders;
      });

      scope.editDatatableEntry = function () {
        scope.isViewMode = false;
        var colName = scope.columnHeaders[0].columnName;
        if(colName == 'id') { scope.columnHeaders.splice(0,1); }

        colName = scope.columnHeaders[0].columnName;
        if(colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
          scope.columnHeaders.splice(0,1);
          scope.isCenter = colName ==  'center_id' ? true : false;
        }
        for(var i in scope.columnHeaders) {

          if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
              scope.formDat[scope.columnHeaders[i].columnName] = scope.columnHeaders[i].value;
          } else{
              scope.formData[scope.columnHeaders[i].columnName] = scope.columnHeaders[i].value;
          }
          if (scope.columnHeaders[i].columnCode) {
            for (var j in scope.columnHeaders[i].columnValues){
              if (scope.columnHeaders[i].value == scope.columnHeaders[i].columnValues[j].value) {
                scope.formData[scope.columnHeaders[i].columnName] = scope.columnHeaders[i].columnValues[j].id;
              }
            }
          }
        }
      };
        scope.deleteDatatableEntry = function (){
            $modal.open({
                templateUrl: 'deletedatatable.html',
                controller: DatatableDeleteCtrl
            });
        };
        var DatatableDeleteCtrl = function ($scope, $modalInstance) {
            $scope.delete = function () {
                resourceFactory.DataTablesResource.delete(reqparams, {}, function(data){
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
                $modalInstance.close('delete');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

      scope.cancel = function () {
        route.reload();
      };

      scope.submit = function () {
        this.formData.locale = scope.optlang.code;
        this.formData.dateFormat =  scope.df;
          for (var i=0; i < scope.columnHeaders.length; i++) {
              if (!_.contains(_.keys(this.formData), scope.columnHeaders[i].columnName)) {
                  this.formData[scope.columnHeaders[i].columnName] = "";
              }
              if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
                  this.formData[scope.columnHeaders[i].columnName] = dateFilter(this.formDat[scope.columnHeaders[i].columnName],scope.df);
              }
          }
        resourceFactory.DataTablesResource.update(reqparams, this.formData, function(data){
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
  mifosX.ng.application.controller('DataTableEntryController', ['$scope', '$location', '$routeParams', '$route', 'ResourceFactory','$modal','dateFilter', mifosX.controllers.DataTableEntryController]).run(function($log) {
    $log.info("DataTableEntryController initialized");
  });
}(mifosX.controllers || {}));
