(function(module) {
    mifosX.directives = _.extend(module, {
        ComboboxDirective: function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs){
                    scope.$watch("selectedDevice", function(){
                            $(".combobox").combobox();
                            scope.comboboxSetup = true;
                    });
                }
            }
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("combobox", [mifosX.directives.ComboboxDirective]).run(function($log) {
    $log.info("ComboboxDirective initialized");
});