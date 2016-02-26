(function (module) {
    mifosX.directives = _.extend(module, {
        NumberFormatDirective: function ($filter, $locale, $parse) {
            return {
                replace: false,
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    var filter = $filter('number');

                    function number(value, fractionLength) {
                        return filter(value, fractionLength);
                    }

                    function initialNumber(value) {
                        var DECIMAL_SEP = '.';
                        var decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                        var stringValue = modelCtrl.$modelValue + '';
                        var num = stringValue.toString();

                        if(stringValue != undefined && stringValue.indexOf(decimalSep) >0 && decimalSep != DECIMAL_SEP) {
                            num = num.replace(decimalSep, DECIMAL_SEP);
                        }
                        var fractionLength = (num.split(DECIMAL_SEP)[1] || []).length;

                        var initialnumber = $filter('number')(num, fractionLength);
                        if (stringValue != undefined && stringValue.indexOf(DECIMAL_SEP) > 0 &&  decimalSep!= DECIMAL_SEP) {
                            num = num.replace(DECIMAL_SEP, decimalSep);
                            var modelGetter = $parse(attrs['ngModel']);
                            // This returns a function that lets us set the value of the ng-model binding expression:
                            var modelSetter = modelGetter.assign;
                            // This is how you can use it to set the value 'bar' on the given scope.
                            modelSetter(scope, num);
                        }
                        return initialnumber;
                    }

                    modelCtrl.$formatters.push(initialNumber);

                    modelCtrl.$parsers.push(function (stringValue) {
                        if (stringValue) {
                            var index = stringValue.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP),
                                decimal,
                                fraction,
                                fractionLength;
                            if (index >= 0) {
                                decimal = stringValue.substring(0, index);
                                fraction = stringValue.substring(index + 1);
                                if (index != stringValue.length - 1)
                                    fractionLength = fraction.length;
                                else
                                    fractionLength = 0;
                            } else {
                                decimal = stringValue;
                                fraction = '';
                            }
                            decimal = decimal.replace(/[^0-9]/g, '');
                            fraction = fraction.replace(/[^0-9]/g, '');
                            var result = decimal;
                            if (fraction.length > 0) {
                                result = result + $locale.NUMBER_FORMATS.DECIMAL_SEP + fraction;
                            }
                            var viewValue = +(decimal + '.' + fraction);
                            if (result !== modelCtrl.$modelValue) {
                                scope.$evalAsync(function () {
                                    modelCtrl.$viewValue = number(viewValue, fractionLength);
                                    modelCtrl.$render();
                                });
                            }
                            return result;
                        }
                    });

                    scope.$on('$localeChangeSuccess', function (event, localeId) {
                        modelCtrl.$viewValue = $filter('number')(modelCtrl.$modelValue);
                        modelCtrl.$render();
                    });

                }
            };
        }
    });
}(mifosX.directives || {}));
mifosX.ng.application.directive("numberFormat", ['$filter', '$locale','$parse', mifosX.directives.NumberFormatDirective]).run(function ($log) {
    $log.info("NumberFormatDirective initialized");
});

