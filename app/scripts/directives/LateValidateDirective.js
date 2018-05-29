(function (module) {
    mifosX.directives = _.extend(module, {
        LateValidateDirective: function () {
            var numRegex = /^([0-9])*([0-9]+(,)[0-9]+)*$/;
            return {
                restrict: 'A',
                require: 'ngModel',
                scope:{
                    number:'@number'
                },

                link: function (scope, elm, attr, ctrl) {
                    if (attr.type === 'radio' || attr.type === 'checkbox') return;
                    elm.bind('blur', function () {
                        scope.$apply(function () {
                            var isMatchRegex = numRegex.test(elm.val());
                            if (elm.val() == "") {
                                ctrl.$setValidity('req', false);
                            } else {
                                ctrl.$setValidity('req', true);
                            }
                            console.log(scope.number);
                            if(scope.number) {
                                if (isMatchRegex || elm.val() == '') {
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