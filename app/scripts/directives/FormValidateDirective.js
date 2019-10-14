(function (module) {
    mifosX.directives = _.extend(module, {
        FormValidateDirective: function ($compile) {
            return {
                restrict: 'E',
                require: '?ngmodel',
                link: function (scope, elm, attr, ctrl) {
                    scope.formNameAttribute = attr.valattributeform;
                    scope.inputAttributeName = attr.valattribute;
                    var template = '<span  ng-show="' + scope.formNameAttribute + '.' + scope.inputAttributeName + '.$invalid">' +
                        '<small class="error" ng-show="' + scope.formNameAttribute + '.' + scope.inputAttributeName + '.$error.req || rc.' + scope.formNameAttribute + '.attempted || ' + scope.formNameAttribute + '.$submitted ">' +
                        '{{' + "'label.requirefield'" + ' | translate}}' +
                        '</small>' +
                        '<small class="required error" ng-show="' + scope.formNameAttribute + '.' + scope.inputAttributeName + '.$error.nval">' +
                        '{{' + "'label.mustbenumeric'" + ' | translate}}' +
                        '</small>' +
                        '</span>';
                    elm.html('').append($compile(template)(scope));

                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("formValidate", ['$compile', mifosX.directives.FormValidateDirective]).run(function ($log) {
    $log.info("FormValidateDirective initialized");
});