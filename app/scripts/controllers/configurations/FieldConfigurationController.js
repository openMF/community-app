/**
 * Created by nikpa on 06-07-2016.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        FieldConfigurationController: function ($scope, resourceFactory, $routeParams, location,route) {

        }

        });
    mifosX.ng.application.controller('FieldConfigurationController', ['$scope', 'ResourceFactory', '$routeParams', '$location','$route', mifosX.controllers.FieldConfigurationController]).run(function ($log) {
        $log.info("FieldConfigurationController initialized");
    });

}(mifosX.controllers || {}));