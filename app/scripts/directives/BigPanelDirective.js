(function(module) {
    mifosX.directives = _.extend(module, {
        BigPanelDirective: function() {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template:
                    "<div class='panelbig'>" +
                        "<div class='panel-header'>" +
                        "<div class='alert-box panel-header-text'>{{title}}</div></div>" +
                        "<div ng-transclude></div></div>"
            };

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("panelbig", [mifosX.directives.BigPanelDirective]).run(function($log) {
    $log.info("BigPanelDirective initialized");
});