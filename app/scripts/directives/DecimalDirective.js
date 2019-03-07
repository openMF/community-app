(function(module) {
    mifosX.directives = _.extend(module, {
        DecimalDirective: function($compile) {
            var linker = function(scope, element, attrs, ngModel) {

                // Runs when the model is first rendered and when the model is changed from code
                ngModel.$render = function() {
                    if (ngModel.$modelValue != null && ngModel.$modelValue >= 0) {
                        element.val(ngModel.$modelValue.toString());
                    }
                }

                // Runs when the view value changes - after each keypress
                ngModel.$parsers.unshift(function(newValue) {
                    var floatValue = parseFloat(newValue);
                    if (isNaN(parseFloat(newValue)))
                       element.val(null);
                    else return floatValue;
                });

                // Formats the displayed value when the input field loses focus
                element.on("change", function(e) {
                    var floatValue = parseFloat(element.val());
                    if (isNaN(floatValue)) {
                        element.val(null);
                    } else {
                        element.val(floatValue);
                    }

                });
            }
            return {
                restrict: 'A',
                require: 'ngModel',
                link: linker
            }
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("decimals", ['$compile', mifosX.directives.DecimalDirective]).run(function($log) {
    $log.info("DecimalDirective initialized");
});