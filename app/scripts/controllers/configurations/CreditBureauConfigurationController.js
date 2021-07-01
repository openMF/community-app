(function (module) {
    mifosX.controllers = _.extend(module, {
        CreditBureauConfigurationController: function ($scope, resourceFactory, $routeParams, location) {

            $scope.formdata = {};


            resourceFactory.creditBureauTemplate.get(function (data) {
                $scope.creditbureaus = data;
                $scope.creditbureauname = $scope.creditbureaus.creditBureauName;

           });


            $scope.submit = function () {
                location.path('/externalservicesCB/CreditBureau/editconfiguration/'+$scope.creditBureauId);
            };
            $scope.cancel = function () {
                location.path('/externalservicesCB/CreditBureau');
            };

        }
    });
    mifosX.ng.application.controller('CreditBureauConfigurationController', ['$scope', 'ResourceFactory', '$routeParams', '$location','$route', mifosX.controllers.CreditBureauConfigurationController]).run(function ($log) {
        $log.info("CreditBureauConfigurationController initialized");
    });
}(mifosX.controllers || {}));
