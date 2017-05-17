(function (module) {
    mifosX.directives = _.extend(module, {
        UploadChangeDirective: function () {
            return{
                scope:{
                    ngUploadChange:"&"
                },
                link:function($scope, $element, $attrs){
                    $element.on("change",function(event){
                        $scope.ngUploadChange({$event: event})
                    })
                    $scope.$on("$destroy",function(){
                        $element.off();
                    });
                }
            }

        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("ngUploadChange", [mifosX.directives.UploadChangeDirective]).run(function ($log) {
    $log.info("UploadChangeDirective initialized");
});