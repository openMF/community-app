(function (module) {
    mifosX.directives = _.extend(module, {
        ApiValidationDirective: function ($compile) {
            return {
                restrict: 'E',
                require: '?ngmodel',
                link: function (scope, elm, attr, ctrl) {
                    var template = '<div uib-alert type="danger" ng-show="errorStatus || errorDetails.length > 0">' +
                        '<div ng-repeat="errorArray in errorDetails">' +
                        '<label><i class="fa fa-exclamation-circle"></i>' +
                        '{{' + 'errorArray.args.params[0].value'    +' | translate}}' + ' field is required' +
                        '</label>' +
                        '<label ng-show="errorStatus">{{errorStatus}}</label><br />' +
                        '<div ng-repeat="error in errorArray">' +
                            '<label ng-hide="errorStatus">' +
                                '{{error.code | translate:error.args}} - {{error.datatable}}' +
                            '</label>' +
                        '</div></div></div>';
                    elm.html('').append($compile(template)(scope));
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("apiValidate", ['$compile', mifosX.directives.ApiValidationDirective]).run(function ($log) {
    $log.info("ApiValidationDirective initialized");
});