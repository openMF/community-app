(function(module) {
  mifosX.directives = _.extend(module, {
    overlayDirective: function() {
      return function(scope, element, attrs) {
        var getSettings = function(selector, options) {
          var defaultSettings = {
            css: { backgroundColor:'transparent', border: '0px'},
            overlayCSS: { opacity: '0.5' },
            fadeIn: 100,
            fadeOut: 200
          };
          var settings = _.extend(defaultSettings, {
            message: $(selector),
          });
          if (options.opacity) {
            settings.overlayCSS.opacity = options.opacity;
          }
          return settings;
        };

        var actionsMap = {
          show: function() {
            $.blockUI(getSettings(element, scope.$eval(attrs.mfOverlayOptions) || {}));
          },
          hide: function() {
            $.unblockUI();
          }
        };

        var eventsMap = scope.$eval(attrs.mfOverlay);
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