(function(module) {
    mifosX.directives = _.extend(module, {
        ApiValidationDirective: function($compile) {
            return {
                restrict: 'E',
                require: '?ngmodel',
                link: function(scope, elm, attr, ctrl) {
                var template = '<div class="error" ng-show="errorStatus || errorDetails">'+
                        '<label>'+
                           '{{'+"'label.error'"+' | translate}}'+                                                                  
                        '</label>'+
                        '<label ng-show="errorStatus">{{errorStatus}}</label>'+
                        '<label ng-hide="errorStatus" ng-repeat="error in errorDetails">'+
                        '{{error.code | translate:error.args}}'+
                        '</label></div>';

                    elm.html('').append($compile(template)(scope));
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("apiValidate", ['$compile', mifosX.directives.ApiValidationDirective]).run(function($log) {
    $log.info("ApiValidationDirective initialized");
});