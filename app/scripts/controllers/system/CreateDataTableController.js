(function(module) {
  mifosX.controllers = _.extend(module, {
    CreateDataTableController: function(scope, routeParams , resourceFactory, location) {

      scope.columns = [];
      scope.columnnameerror = false;
      scope.columntypeerror = false;
      scope.datatableTemplate = {};
      scope.labelerror = "requiredfield";

      resourceFactory.codeResources.getAllCodes({}, function(data) {
        scope.codes = data;
      });

      scope.addColumn = function () {
        if (scope.datatableTemplate.columnName && scope.datatableTemplate.columnType) {
          scope.columnnameerror = false;
          scope.columntypeerror = false;
          scope.columns.push({name:scope.datatableTemplate.columnName, type:scope.datatableTemplate.columnType, mandatory:false});
          scope.datatableTemplate.columnName = undefined;
          scope.datatableTemplate.columnType = undefined;
        } else if (!scope.datatableTemplate.columnName) {
          scope.errorDetails = [];
          scope.columnnameerror = true;
          scope.labelerror = "columnnameerr";
        } else if (scope.datatableTemplate.columnName) {
          scope.errorDetails = [];
          scope.columntypeerror = true;
          scope.labelerror = "columntypeerr";
        } 
      };

      scope.removeColumn = function (index) {
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
        if (scope.columns.length == 0) {
          scope.errorDetails = [];
          scope.errorDetails.push({code:'error.msg.click.on.add.to.add.columns'});
        }else {
          delete scope.errorDetails;
          scope.formData.multiRow = scope.formData.multiRow || false;
          scope.formData.columns = scope.columns;
          resourceFactory.DataTablesResource.save(this.formData,function(data){
            location.path('/viewdatatable/' + data.resourceIdentifier);
          });
        }
      };
    }
  });
  mifosX.ng.application.controller('CreateDataTableController', ['$scope', '$routeParams','ResourceFactory', '$location', mifosX.controllers.CreateDataTableController]).run(function($log) {
    $log.info("CreateDataTableController initialized");
  });
}(mifosX.controllers || {}));
