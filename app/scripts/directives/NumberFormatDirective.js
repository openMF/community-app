(function (module) {
    mifosX.directives = _.extend(module, {
        NumberFormatDirective: function ($filter) {
            return {
                replace: false,
                //restrict: "A",
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    var filter = $filter('number');
                    
                    function number(value, fractionLength) {
                      return filter(value, fractionLength);
                    }
                    modelCtrl.$formatters.push(number);
                    modelCtrl.$parsers.push(function (stringValue) {
                      var index = stringValue.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP),
                        decimal,
                        fraction,
                        fractionLength;
                      if (index >= 0) {
                        decimal = stringValue.substring(0, index);
                        fraction = stringValue.substring(index + 1);
                        if(index!=stringValue.length-1)
                          fractionLength = fraction.length;
                        else
                          fractionLength = 0;
                      } else {
                        decimal = stringValue;
                        fraction = '';
                      }
                      decimal = decimal.replace(/[^0-9]/g, '');
                      fraction = fraction.replace(/[^0-9]/g, '');
                      var result = +(decimal + '.' + fraction);
                      if (result !== modelCtrl.$modelValue) {
                        scope.$evalAsync(function () {
                          modelCtrl.$viewValue = number(modelCtrl.$modelValue, fractionLength);
                          modelCtrl.$render();
                        });
                      }
                      return result;
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
mifosX.ng.application.directive("numberFormat", ['$filter', mifosX.directives.NumberFormatDirective]).run(function ($log) {
    $log.info("NumberFormatDirective initialized");
});

