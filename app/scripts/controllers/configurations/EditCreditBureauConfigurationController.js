(function (module) {
    mifosX.controllers = _.extend(module, {
        EditCreditBureauConfigurationController: function (scope, resourceFactory, $routeParams, location) {

            scope.bureauId= $routeParams.creditbureauId;
            scope.formData = {};
            scope.creditBureauConfigurationId='';


            resourceFactory.fetchCreditBureauConfiguration.get({organisationCreditBureauId: scope.bureauId},function (data) {
               scope.creditBureauConfigurations = data;
            });

            scope.submits = function () {
                resourceFactory.updateCreditBureauConfiguration.put({configurationId: scope.creditBureauConfiguration.creditBureauConfigurationId}, this.formData, function () {
                });
            };
            scope.cancel = function () {
                location.path('externalservicesCB/CreditBureau/configuration');
            };

            scope.add = function () {
                location.path('/externalservicesCB/CreditBureau/newconfiguration/');
            };

        }
    });
    mifosX.ng.application.controller('EditCreditBureauConfigurationController', ['$scope', 'ResourceFactory', '$routeParams', '$location','$route', mifosX.controllers.EditCreditBureauConfigurationController]).run(function ($log) {
        $log.info("EditCreditBureauConfigurationController initialized");
    });
}(mifosX.controllers || {}));
