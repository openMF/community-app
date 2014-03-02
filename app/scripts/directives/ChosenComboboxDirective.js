(function (module) {
    mifosX.directives = _.extend(module, {
        ChosenComboboxDirective: function ($compile) {
            var linker = function (scope, element, attrs) {
                var list = attrs['chosen'];
                scope.$watch(list, function () {
                    element.trigger('liszt:updated');
                    element.trigger("chosen:updated");
                });

                element.chosen();
            };

            return {
                restrict: 'A',
                link: linker
            }
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("chosen", ['$compile', mifosX.directives.ChosenComboboxDirective]).run(function ($log) {
    $log.info("ChosenComboboxDirective initialized");
});