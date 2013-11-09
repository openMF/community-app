(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateChargeController: function(scope, resourceFactory,location) {
            scope.template = [];
            scope.formData = {};
            resourceFactory.chargeTemplateResource.get(function(data) {
                scope.template = data;
                scope.showChargePaymentByField = true;
                scope.chargeCalculationTypeOptions = data.chargeCalculationTypeOptions;
                scope.chargeTimeTypeOptions = data.chargeTimeTypeOptions;
            });

            scope.chargeAppliesToSelected = function(chargeAppliesId) {
                if (chargeAppliesId == 1) {
                    scope.showChargePaymentByField = true;
                    scope.chargeCalculationTypeOptions = scope.template.loanChargeCalculationTypeOptions;
                    scope.chargeTimeTypeOptions = scope.template.loanChargeTimeTypeOptions;
                } else {
                    scope.showChargePaymentByField = false;
                    scope.chargeCalculationTypeOptions = scope.template.savingsChargeCalculationTypeOptions;
                    scope.chargeTimeTypeOptions = scope.template.savingsChargeTimeTypeOptions;
                }
            }

            scope.setChoice = function(){
                if(this.formData.active){
                    scope.choice = 1;
                }
                else if(!this.formData.active){
                    scope.choice = 0;
                }
            };

            scope.submit = function() {
                if (!scope.showChargePaymentByField) {
                    delete this.formData.chargePaymentMode;
                }
                this.formData.active = this.formData.active || false;
                this.formData.locale = 'en';
                this.formData.monthDayFormat = 'dd MMM';
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
