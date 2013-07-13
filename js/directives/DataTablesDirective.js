(function(module) {
  mifosX.directives = _.extend(module, {
    dataTableDirective: function() {
      return function(scope, element, attrs) {
        var defaultOptions = {
          bDeferRender: true,
          bJQueryUI: true,
          bPaginate: true,
        };
        var options = _.extend(defaultOptions, scope.$eval(attrs.mfDataTable));

        scope.$watch(attrs.mfDataTableItems, function(newItems, oldItems) {
          if (newItems && newItems.length > 0 && !angular.equals(newItems, oldItems)) {
            scope.$evalAsync(function() { $(element).dataTable(options); });
          }
        });
      };
    }
  });
}(mifosX.directives || {}));

mifosX.ng.application.directive("mfDataTable", [mifosX.directives.dataTableDirective]).run(function($log) {
  $log.info("dataTableDirective initialized");
});