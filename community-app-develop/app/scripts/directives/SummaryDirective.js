(function (module) {
    mifosX.directives = _.extend(module, {
        SummaryDirective: function () {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template: "<div class='summary'>" +
                    "<div class='summary-header'>" +
                    "<div class='summary-header-text'>{{title}}</div></div>" +
                    "<div ng-transclude></div></div>"
            };

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("ngSummary", [mifosX.directives.SummaryDirective]).run(function ($log) {
    $log.info("SummaryDirective initialized");
});