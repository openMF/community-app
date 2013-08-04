(function(module) {
  mifosX.directives = _.extend(module, {
    dataTableDirective: function() {
      return function(scope, element, attrs) {
        var defaultOptions = {
          bDeferRender: true,
          bJQueryUI: true,
          bPaginate: true,
          bRetrieve: true
        };
        var options = _.extend(defaultOptions, scope.$eval(attrs.mfDataTable));
        var columnNames = attrs.mfDataTableColumns.split(',');
        options.aoColumns = _.map(columnNames, function(propertyName) {
          return {mData: propertyName};
        });
        var table = $(element).dataTable(options);

        scope.$watch(attrs.mfDataTableItems, function(newItems, oldItems) {
          if (newItems && newItems.length > 0 && !angular.equals(newItems, oldItems)) {
            scope.$evalAsync(function() {
              table.fnClearTable();
              table.fnAddData(newItems);
            });
          }
        }, true);
      };
    }
  });
}(mifosX.directives || {}));

mifosX.ng.application.directive("mfDataTable", [mifosX.directives.dataTableDirective]).run(function($log) {
  $log.info("dataTableDirective initialized");
});