(function (module) {
    mifosX.controllers = _.extend(module, {
        AddNewCreditBureauConfigurationController: function ($scope, resourceFactory, $routeParams, location) {

            $scope.bureauId= $routeParams.creditbureauId;
            $scope.formdata = {};


            /*resourceFactory.fetchCreditBureauConfiguration.get({organisationCreditBureauId: $scope.bureauId},function (data) {
                $scope.creditBureauConfigurations = data;
            });*/

            $scope.addConfig = function (creditBureauId) {
                resourceFactory.addCreditBureauConfiguration.post({creditBureauId: creditBureauId}, this.formdata, function (data) {
                });
              console.log('CreditBureauId: ' + creditBureauId);
            };
            $scope.cancel = function () {
                location.path('externalservicesCB/CreditBureau/configuration');
            };

            $scope.add = function () {
                location.path('externalservicesCB/CreditBureau/configuration/addnewconfig');
            };

        }
    });
    mifosX.ng.application.controller('AddNewCreditBureauConfigurationController', ['$scope', 'ResourceFactory', '$routeParams', '$location','$route', mifosX.controllers.AddNewCreditBureauConfigurationController]).run(function ($log) {
        $log.info("AddNewCreditBureauConfigurationController initialized");
    });
}(mifosX.controllers || {}));
