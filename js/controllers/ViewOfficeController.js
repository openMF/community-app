(function(module) {
  mifosX.controllers = _.extend(module, {
    ViewOfficeController: function(scope, routeParams , resourceFactory ) {
        scope.charges = [];
        resourceFactory.officeResource.get({officeId: routeParams.id} , function(data) {
            scope.office = data;
        });
    }
  });
  mifosX.ng.application.controller('ViewOfficeController', ['$scope', '$routeParams','ResourceFactory', mifosX.controllers.ViewOfficeController]).run(function($log) {
    $log.info("ViewOfficeController initialized");
  });
}(mifosX.controllers || {}));
