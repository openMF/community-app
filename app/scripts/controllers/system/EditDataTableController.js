(function(module) {
  mifosX.controllers = _.extend(module, {
    EditDataTableController: function(scope, routeParams , resourceFactory, location) {

      scope.columns = [];
      scope.dropColumns = [];
      scope.formData = {};
      scope.columnnameerror = false;
      scope.columntypeerror = false;
      scope.datatableTemplate = {};

      resourceFactory.codeResources.getAllCodes({}, function(data) {
        scope.codes = data;
      });

      resourceFactory.DataTablesResource.getTableDetails({datatablename: routeParams.tableName} , function(data) {
        scope.datatable = data;

        scope.formData.apptableName = data.applicationTableName;

        var temp=[];
        var colName = data.columnHeaderData[0].columnName;
        if(colName == 'id') {
          data.columnHeaderData.splice(0,1);
        }
        colName = data.columnHeaderData[0].columnName;
        if(colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
          data.columnHeaderData.splice(0,1);
        }

        for(var i in data.columnHeaderData) {

          data.columnHeaderData[i].originalName = data.columnHeaderData[i].columnName;
          if(data.columnHeaderData[i].columnName.indexOf("_cd_") > 0) {
            temp = data.columnHeaderData[i].columnName.split("_cd_");
            data.columnHeaderData[i].columnName = temp[1];
            data.columnHeaderData[i].code = temp[0];
          }

          var tempColumn = {name:data.columnHeaderData[i].columnName, mandatory:!data.columnHeaderData[i].isColumnNullable};
          tempColumn.originalName = data.columnHeaderData[i].originalName;
          var colType = data.columnHeaderData[i].columnDisplayType.toLowerCase();
          
          if(colType == 'integer') { colType = 'number'; }
          else if(colType == 'codelookup') { colType = 'dropdown'; }
          tempColumn.type = colType;

          if (colType == 'string') { tempColumn.length = data.columnHeaderData[i].columnLength; }

          if (data.columnHeaderData[i].columnCode) { tempColumn.code = data.columnHeaderData[i].columnCode; }

          scope.columns.push(tempColumn);
        }
      });

      scope.addColumn = function () {
        if (scope.datatableTemplate.columnName && scope.datatableTemplate.columnType) {
          scope.columnnameerror = false;
          scope.columntypeerror = false;
          scope.columns.push({name:scope.datatableTemplate.columnName, type:scope.datatableTemplate.columnType, mandatory:false});
          scope.datatableTemplate.columnName = undefined;
          scope.datatableTemplate.columnType = undefined;
        } else if (!scope.datatableTemplate.columnName) {
          scope.columnnameerror = true;
          scope.labelerror = "columnnameerr";
        } else if (scope.datatableTemplate.columnName) {
          scope.columntypeerror = true;
          scope.labelerror = "columntypeerr";
        } 
      };

      scope.removeColumn = function (index) {
        if (scope.columns[index].originalName) {
          scope.dropColumns.push({name:scope.columns[index].originalName});
        }
        scope.columns.splice(index,1);
      };

      scope.updateDepenedencies = function (index) {
        if (scope.columns[index].type != 'string') {
          scope.columns[index].length = undefined;
        }
        if (scope.columns[index].type != 'dropdown') {
          scope.columns[index].code = undefined;
        }
      };

      scope.submit = function () {

        scope.formData.addColumns = [];
        scope.formData.changeColumns = [];

        if (scope.dropColumns.length > 0) {
          scope.formData.dropColumns = scope.dropColumns;
        }

        for (var i in scope.columns) {

          if (scope.columns[i].originalName) {
            //This value should be updated based on the configuration
            /*if (scope.columns[i].newName) {
              if (scope.columns[i].type == "dropdown") {
                scope.columns[i].columnName = scope.columns[i].originalName;
                scope.columns[i].newName = scope.columns[i].columnCode + "_cd_" + scope.columns[i].newName;
              }
            }*/
            
            delete scope.columns[i].originalName;
            delete scope.columns[i].type;

            if (scope.columns[i].code) {
              scope.columns[i].newCode = scope.columns[i].newCode || scope.columns[i].code;
            }

            if (scope.columns[i].name) {
              scope.columns[i].newName = scope.columns[i].newName || scope.columns[i].name;
            }
            scope.formData.changeColumns.push(scope.columns[i]);

          } else {
            scope.formData.addColumns.push(scope.columns[i]);
          }
        }

        if (scope.formData.addColumns.length == 0) delete scope.formData.addColumns;
        if (scope.formData.changeColumns.length == 0) delete scope.formData.changeColumns;

        resourceFactory.DataTablesResource.update({datatablename: routeParams.tableName}, this.formData, function(data){
          location.path('/viewdatatable/' + data.resourceIdentifier);
        });
      };
    }
  });
  mifosX.ng.application.controller('EditDataTableController', ['$scope', '$routeParams','ResourceFactory', '$location', mifosX.controllers.EditDataTableController]).run(function($log) {
    $log.info("EditDataTableController initialized");
  });
}(mifosX.controllers || {}));
