(function (module) {
    mifosX.controllers = _.extend(module, {
        NewAppController: function ($scope, $routeParams) {
           console.log($routeParams.path);
           $scope.appPath = $routeParams.path;

        }
    });
    mifosX.ng.application.controller('NewAppController', ['$scope', '$routeParams', mifosX.controllers.NewAppController]).run(function ($log) {
        $log.info("NewAppController initialized");
    });
}(mifosX.controllers || {}));
