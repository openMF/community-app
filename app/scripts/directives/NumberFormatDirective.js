(function (module) {
    mifosX.directives = _.extend(module, {
        NumberFormatDirective: function ($filter) {
            return {
                replace: false,
                //restrict: "A",
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {

                    var formatNumber = function (inputValue) {
                        if (typeof (inputValue) == "undefined") return '';
                        inputValue = inputValue.replace(/,/g, "")

                        var transformedInput = inputValue/*.replace(/\D/g, '')*/
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        //transformedInput=transformedInput.replace(/\.\d*/g,'')
                        //if (transformedInput != inputValue) {
                            modelCtrl.$viewValue = transformedInput;
                            modelCtrl.$render();
                        //}
                        return transformedInput;
                    };
                    modelCtrl.$parsers.push(formatNumber);
                }
            };
        }
    });
}(mifosX.directives || {}));
mifosX.ng.application.directive("numberFormat", ['$filter', mifosX.directives.NumberFormatDirective]).run(function ($log) {
    $log.info("NumberFormatDirective initialized");
});

