(function(module) {
  mifosX.directives = _.extend(module, {
    overlayDirective: function() {
      return function(scope, element, attrs) {
        var options = scope.$eval(attrs.mfOverlayOptions) || {};
        var eventsMap = scope.$eval(attrs.mfOverlay);
        var target = attrs.mfOverlayTarget;

        $.blockUI.defaults.css = {};
        var settings = {
          message: $(element),
          overlayCSS: { opacity: (options.opacity || '0.5') },
          fadeIn: options.fadeIn || 100,
          fadeOut: options.fadeOut || 200
        };

        var actionsMap = (function() {
          var selector = target ? $(target) : $;
          var showFn = target ? 'block' : 'blockUI';
          var hideFn = target ? 'unblock' : 'unblockUI';
          return {
            show: function() {
              selector[showFn](settings);
            },
            hide: function() {
              selector[hideFn]();
            }
          };
        }());

        _.each(_.keys(eventsMap), function(actionName) {
          var events = eventsMap[actionName].split(',');
          _.each(events, function(eventName) {
            scope.$on(eventName, actionsMap[actionName]);
          });
        });
      };
    }
  });
}(mifosX.directives || {}));

mifosX.ng.application.directive("mfOverlay", [mifosX.directives.overlayDirective]).run(function($log) {
  $log.info("overlayDirective initialized");
});