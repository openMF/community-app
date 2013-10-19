(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewChargeController: function(scope, routeParams , resourceFactory, location) {
        scope.charge = [];
        scope.choice = 0;
        resourceFactory.chargeResource.get({chargeId: routeParams.id} , function(data) {
            scope.charge = data;
        });

        scope.deletepop = function(){
            scope.choice = 1;
        };
        scope.cancel = function(){
            scope.choice = 0;
        };
        scope.deleteCharge = function(){
            resourceFactory.chargeResource.delete({chargeId: routeParams.id} , {}, function(data) {
                location.path('/charges');
            });
        }
    }
  });
  mifosX.ng.application.controller('ViewChargeController', ['$scope', '$routeParams','ResourceFactory', '$location', mifosX.controllers.ViewChargeController]).run(function($log) {
    $log.info("ViewChargeController initialized");
  });
}(mifosX.controllers || {}));
