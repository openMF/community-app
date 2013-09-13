(function(module) {
    mifosX.controllers = _.extend(module, {
        ViewHolController: function(scope,routeParams, resourceFactory) {
            scope.holidays = [];
            scope.officehols = [];
            resourceFactory.holResource.getAllHols({officeId:1},function(data){
                scope.holidays = data;
            });
            resourceFactory.holValueResource.getholvalues({officeId:1,holId: routeParams.id} , function(data) {
                scope.officehols = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewHolController', ['$scope','$routeParams', 'ResourceFactory', mifosX.controllers.ViewHolController]).run(function($log) {
        $log.info("ViewHolController initialized");
    });
}(mifosX.controllers || {}));

