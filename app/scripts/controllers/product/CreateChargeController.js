(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateChargeController: function(scope, resourceFactory,location) {
            scope.template = [];
            resourceFactory.chargeTemplateResource.get(function(data) {
                scope.template = data;
            });
            scope.submit = function() {
                this.formData.locale = 'en';
                resourceFactory.chargeResource.save(this.formData,function(data){
                    location.path('/viewcharge/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateChargeController', ['$scope', 'ResourceFactory','$location', mifosX.controllers.CreateChargeController]).run(function($log) {
        $log.info("CreateChargeController initialized");
    });
}(mifosX.controllers || {}));
