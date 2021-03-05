/**
 * Created by Jose on 25/07/2017.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewRateController: function (scope, routeParams, resourceFactory, location, $uibModal) {
            scope.rate = [];
            scope.choice = 0;
            resourceFactory.rateResource.getRate({rateId: routeParams.rateId}, function (data) {
                scope.rate = data;
            });


        }
    });
    mifosX.ng.application.controller('ViewRateController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewRateController]).run(function ($log) {
        $log.info("ViewRateController initialized");
    });
}(mifosX.controllers || {}));
