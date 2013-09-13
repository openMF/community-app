(function(module) {
  mifosX.directives = _.extend(module, {
    dialogDirective: function() {
      return function(scope, element, attrs) {
        var options = scope.$eval(attrs.mfDialogOptions) || {};
        var eventsMap = scope.$eval(attrs.mfDialog);

        $(element).dialog(_.defaults(options, {
          autoOpen:  false,
          draggable: false,
          resizable: false
        }));

        var actionsMap = {
          show: function(event, data) {
            $(element).dialog( "option", "title", data.title );
            $(element).dialog('open');
          },
          hide: function(event, data) {
            $(element).dialog('close');
          }
        };

        _.each(_.keys(actionsMap), function(actionName) {
          var events = eventsMap[actionName].split(',');
          _.each(events, function(eventName) {
            scope.$on(eventName, actionsMap[actionName]);
          });
        });
      };
    }
  });
}(mifosX.directives || {}));

mifosX.ng.application.directive("mfDialog", [mifosX.directives.dialogDirective]).run(function($log) {
  $log.info("dialogDirective initialized");
});