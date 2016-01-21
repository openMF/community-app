(function (module) {
    mifosX.directives = _.extend(module, {
        ChosenComboboxDirective: function ($compile, $timeout) {
            var linker = function (scope, element, attrs) {
                var list = attrs['chosen'];
                scope.$watch(list, function () {
                    $timeout(function() {
                        element.trigger('liszt:updated');
                        element.trigger("chosen:updated");
                    }, 0, false);

                }, true);



                $timeout(function() {
                    element.chosen({search_contains:true});
                }, 0, false);
            };

            return {
                restrict: 'A',
                link: linker
            }
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("chosen", ['$compile','$timeout', mifosX.directives.ChosenComboboxDirective]).run(function ($log) {
    $log.info("ChosenComboboxDirective initialized");
});