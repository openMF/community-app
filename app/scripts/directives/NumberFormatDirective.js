(function (module) {
    mifosX.directives = _.extend(module, {
        NumberFormatDirective: function ($filter) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attr, ctrl) {
                  var filter = $filter('number');
                  
                  function number(value) {
                    return filter(value);
                  }
                  ctrl.$formatters.push(number);
                  ctrl.$parsers.push(function (stringValue) {
                    var index = stringValue.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP),
                      decimal,
                      fraction;
          
                    if (index >= 0) {
                      decimal = stringValue.substring(0, index);
                      fraction = stringValue.substring(index + 1);
                    } else {
                      decimal = stringValue;
                      fraction = '';
                    }
                    decimal = decimal.replace(/[^0-9]/g, '');
                    fraction = fraction.replace(/[^0-9]/g, '');
                    var result = +(decimal + '.' + fraction);
                    if (result !== ctrl.$modelValue) {
                      scope.$evalAsync(function () {
                        ctrl.$viewValue = number(ctrl.$modelValue);
                        ctrl.$render();
                      });
                    }
                    return result;
                  });
                  scope.$on('$localeChangeSuccess', function (event, localeId) {
                    ctrl.$viewValue = $filter('number')(ctrl.$modelValue);
                    ctrl.$render();
                  });
          
                }
            };
        }
    });
}(mifosX.directives || {}));
mifosX.ng.application.directive("numberFormat", ['$filter', mifosX.directives.NumberFormatDirective]).run(function ($log) {
    $log.info("NumberFormatDirective initialized");
});

