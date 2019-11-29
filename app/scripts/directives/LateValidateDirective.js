(function (module) {
    mifosX.directives = _.extend(module, {
        LateValidateDirective: function () {
            var numRegex = /^([0-9])*([0-9]+(,)[0-9]+)*$/;
            var decimalRegex=/^([0-9])*([0-9]+(,)[0-9]+)*([0-9]+(\.)[0-9]+)*$/;
            return {
                restrict: 'A',
                require: 'ngModel',
                scope:{
                    number:'@number',
                    decimalNumber:'@decimalNumber'
                },

                link: function (scope, elm, attr, ctrl) {
                    if (attr.type === 'radio' || attr.type === 'checkbox' || attr.type ==='input') return;
                    elm.bind('blur', function () {
                        scope.$apply(function () {
                            var isMatchRegex = numRegex.test(elm.val());
                            var isDecimalMatchRegex=decimalRegex.test(elm.val());
                            if (elm.val() === null) {
                                ctrl.$setValidity('req', false);
                            } else {
                                ctrl.$setValidity('req', true);
                            }
                            if(scope.number) {
                                if (isMatchRegex || elm.val() === '') {
                                    ctrl.$setValidity('nval', true);
                                } else {
                                    ctrl.$setValidity('nval', false);
                                }
                            }
                            if(scope.decimalNumber) {
                                if (isDecimalMatchRegex || elm.val() == '') {
                                    ctrl.$setValidity('nval', true);
                                } else {
                                    ctrl.$setValidity('nval', false);
                                }
                            }
                        });
                    });
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("lateValidate", [mifosX.directives.LateValidateDirective]).run(function ($log) {
    $log.info("LateValidateDirective initialized");
});