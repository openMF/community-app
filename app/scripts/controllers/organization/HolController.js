(function(module) {
    mifosX.controllers = _.extend(module, {
        HolController: function(scope, resourceFactory) {
            scope.holidays = [];
            resourceFactory.holResource.getAllHols({officeId:1},function(data){
                scope.holidays = data;
            });
        }
    });
    mifosX.ng.application.controller('HolController', ['$scope', 'ResourceFactory', mifosX.controllers.HolController]).run(function($log) {
        $log.info("HolController initialized");
    });
}(mifosX.controllers || {}));

