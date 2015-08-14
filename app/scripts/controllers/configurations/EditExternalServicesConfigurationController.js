/**
 * Created by 27 on 04-08-2015.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        EditExternalServicesConfigurationController: function ($scope, resourceFactory, $routeParams, location) {
            $scope.formData = [];
            $scope.names = [];
            $scope.externalServicesType = $routeParams.externalServicesType;
            //$scope.name = $routeParams.name;
            var nvObject = {};
            resourceFactory.externalServicesResource.get({id: $scope.externalServicesType}, function (data) {
                for (var i in data) {
                    if(data[i] != null && data[i].name != null) {
                        data[i].name.replace(/ /g, '');
                        if (!angular.equals(data[i].name, "")) {
                            nvObject[data[i].name] = data[i].value;
                            $scope.names.push(data[i].name);

                        }
                    }
                }
                $scope.formData = nvObject;


            });

            $scope.cancel = function () {
                location.path('/externalservices/'+ $scope.externalServicesType);
            };

            $scope.submit = function () {

                //scope.formData1 = {  scope.name : scope.formData.value};
                resourceFactory.externalServicesResource.put({id: $scope.externalServicesType}, this.formData, function (data) {
                    location.path('/externalservices' );
                });
            };
        }

    });
    mifosX.ng.application.controller('EditExternalServicesConfigurationController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.EditExternalServicesConfigurationController]).run(function ($log) {
        $log.info("EditExternalServicesConfigurationController initialized");
    });

}(mifosX.controllers || {}));
