(function(module) {
    mifosX.controllers = _.extend(module, {
        HolController: function(scope, resourceFactory) {
            scope.holidays = [];
            scope.offices = [];
            scope.formData={officeId:1};
            resourceFactory.holResource.getAllHols({officeId:scope.formData.officeId},function(data){
                scope.holidays = data;
            });
            resourceFactory.officeResource.getAllOffices(function(data){
                scope.offices = data;
            });
            scope.getHolidays = function(){
                resourceFactory.holResource.getAllHols({officeId:scope.formData.officeId},function(data){
                    scope.holidays = data;
                });
            };
        }
    });
    mifosX.ng.application.controller('HolController', ['$scope', 'ResourceFactory', mifosX.controllers.HolController]).run(function($log) {
        $log.info("HolController initialized");
    });
}(mifosX.controllers || {}));

