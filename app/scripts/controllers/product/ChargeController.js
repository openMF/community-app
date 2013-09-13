(function(module) {
  mifosX.controllers = _.extend(module, {
    ChargeController: function(scope, resourceFactory) {
        scope.charges = [];
        scope.$broadcast('ChargeDataLoadingStartEvent');
        resourceFactory.chargeResource.getAllCharges(function(data) {
            scope.charges = data;
            scope.$broadcast('ChargeDataLoadingCompleteEvent');
        });
    }
  });
  mifosX.ng.application.controller('ChargeController', ['$scope', 'ResourceFactory', mifosX.controllers.ChargeController]).run(function($log) {
    $log.info("ChargeController initialized");
  });
}(mifosX.controllers || {}));
