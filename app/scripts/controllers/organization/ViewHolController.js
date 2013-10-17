(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewHolController: function(scope,routeParams, resourceFactory) {

            resourceFactory.holValueResource.getholvalues({officeId:1,holId: routeParams.id} , function(data) {
                scope.holiday = data;
            });

        }
    });
    mifosX.ng.application.controller('ViewHolController', ['$scope','$routeParams', 'ResourceFactory', mifosX.controllers.ViewHolController]).run(function($log) {
        $log.info("ViewHolController initialized");
    });
}(mifosX.controllers || {}));

