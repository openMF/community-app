(function(module) {
    mifosX.controllers = _.extend(module, {
        EditChargeController: function(scope, resourceFactory,location,routeParams) {
            scope.template = [];
            resourceFactory.chargeResource.getCharge({chargeId: routeParams.id,template:true}, function(data) {
                scope.template = data;
                scope.formData = {
                    name:data.name,
                    active:data.active,
                    penalty:data.penalty,
                    currencyCode:data.currency.code,
                    chargeAppliesTo:data.chargeAppliesTo.id,
                    chargeTimeType:data.chargeTimeType.id,
                    chargeCalculationType:data.chargeCalculationType.id,
                    chargePaymentMode:data.chargePaymentMode.id,
                    amount:data.amount
                };
            });
            scope.submit = function() {
                this.formData.locale = 'en';
                this.formData.active = this.formData.active || false;
                this.formData.penalty = this.formData.penalty || false;
                resourceFactory.chargeResource.update({chargeId: routeParams.id},this.formData,function(data){
                    location.path('/viewcharge/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditChargeController', ['$scope', 'ResourceFactory','$location','$routeParams', mifosX.controllers.EditChargeController]).run(function($log) {
        $log.info("EditChargeController initialized");
    });
}(mifosX.controllers || {}));
