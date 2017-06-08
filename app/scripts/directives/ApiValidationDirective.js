(function (module) {
    mifosX.directives = _.extend(module, {
        ApiValidationDirective: function ($compile) {
            return {
                restrict: 'E',
                require: '?ngmodel',
                link: function (scope, elm, attr, ctrl) {
                    var template = '<div class="error" ng-repeat="errorArray in errorDetails" ng-show="errorStatus || errorDetails">' +
                        '<label>' +
                        '{{' + 'errorArray.args.params[0].value'    +' | translate}}' + ' field is required' +
                        '</label>' +
                        '<label ng-show="errorStatus">{{errorStatus}}</label><br />' +
                        '<div ng-repeat="error in errorArray">' +
                            '<label ng-hide="errorStatus">' +
                                '{{error.code | translate:error.args}}' +
                            '</label>'
                        '</div></div>';
                    elm.html('').append($compile(template)(scope));
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("apiValidate", ['$compile', mifosX.directives.ApiValidationDirective]).run(function ($log) {
    $log.info("ApiValidationDirective initialized");
});