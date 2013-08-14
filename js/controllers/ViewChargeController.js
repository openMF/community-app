(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewChargeController: function(scope, routeParams , resourceFactory ) {
        scope.charges = [];
        resourceFactory.chargeResource.get({chargeId: routeParams.id} , function(data) {
            scope.charge = data;
        });
    }
  });
  mifosX.ng.application.controller('ViewChargeController', ['$scope', '$routeParams','ResourceFactory', mifosX.controllers.ViewChargeController]).run(function($log) {
    $log.info("ViewChargeController initialized");
  });
}(mifosX.controllers || {}));
