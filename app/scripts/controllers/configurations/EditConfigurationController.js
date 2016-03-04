(function (module) {
    mifosX.controllers = _.extend(module, {
        EditConfigurationController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.configId = routeParams.configId;
            scope.organisationStartDate = false;
            resourceFactory.configurationResource.get({id: scope.configId}, function (data) {
                if(data.dateValue){
                    scope.organisationStartDate = true;
                }
                scope.formData = {value: data.value, dateValue: data.dateValue};
            });
            scope.cancel = function () {
                location.path('/global');
            };


            scope.submit = function () {
                if(scope.formData.dateValue){
                    this.formData.locale = scope.optlang.code;
                    this.formData.dateFormat = scope.df;
                    this.formData.dateValue = dateFilter(scope.formData.dateValue, scope.df);
                }
                resourceFactory.configurationResource.update({resourceType: 'configurations', id: scope.configId}, this.formData, function (data) {
                    location.path('/global');
                });
            };

        }
    });
    mifosX.ng.application.controller('EditConfigurationController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.EditConfigurationController]).run(function ($log) {
        $log.info("EditConfigurationController initialized");
    });
}(mifosX.controllers || {}));
