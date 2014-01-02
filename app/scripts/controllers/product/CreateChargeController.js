(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateChargeController: function(scope, resourceFactory,location, dateFilter) {
            scope.template = [];
            scope.formData = {};
            scope.first = {};
            scope.isCollapsed = true;
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first.date = new Date();

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
            //when chargeAppliesTo is savings, below logic is
            //to display 'Due date' field, if chargeTimeType is
            //'annual fee' or 'monthly fee'
            scope.chargeTimeChange = function (chargeTimeType) {
                if (scope.showChargePaymentByField === false) {
                    for(var i in scope.chargeTimeTypeOptions) {
                        if (chargeTimeType === scope.chargeTimeTypeOptions[i].id) {
                            if (scope.chargeTimeTypeOptions[i].value == "Annual Fee" || scope.chargeTimeTypeOptions[i].value == "Monthly Fee") {
                                scope.showdatefield = true;
                                //to show 'repeats every' field for monthly fee
                                if (scope.chargeTimeTypeOptions[i].value == "Monthly Fee") {
                                    scope.repeatEvery = true;
                                } else {
                                    scope.repeatEvery = false;
                                }
                            } else {
                                scope.showdatefield = false;
                            }
                        }
                    }
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
                //when chargeTimeType is 'annual' or 'monthly fee' then feeOnMonthDay added to
                //the formData
                if (scope.showChargePaymentByField === false) {
                    if (scope.showdatefield === true) {
                        var reqDate = dateFilter(scope.first.date,'dd MMMM');
                        this.formData.monthDayFormat = 'dd MMM';
                        this.formData.feeOnMonthDay  = reqDate;
                    }
                }

                if (!scope.showChargePaymentByField) {
                    delete this.formData.chargePaymentMode;
                }
                this.formData.active = this.formData.active || false;
                this.formData.locale = scope.optlang.code;
                this.formData.monthDayFormat = 'dd MMM';
                resourceFactory.chargeResource.save(this.formData,function(data){
                    location.path('/viewcharge/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateChargeController', ['$scope', 'ResourceFactory','$location', 'dateFilter', mifosX.controllers.CreateChargeController]).run(function($log) {
        $log.info("CreateChargeController initialized");
    });
}(mifosX.controllers || {}));
