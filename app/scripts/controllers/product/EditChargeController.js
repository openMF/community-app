(function (module) {
    mifosX.controllers = _.extend(module, {
        EditChargeController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.template = [];
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first = {};
            scope.flag = false;
	        scope.showPenalty = true ;
            scope.slabs = [];
            scope.slab = {};
            scope.showSlabBasedCharges = false;

            resourceFactory.chargeResource.getCharge({chargeId: routeParams.id, template: true}, function (data) {
                scope.template = data;
                scope.incomeAccountOptions = data.incomeOrLiabilityAccountOptions.incomeAccountOptions || [];
                scope.liabilityAccountOptions = data.incomeOrLiabilityAccountOptions.liabilityAccountOptions || [];
                scope.incomeAndLiabilityAccountOptions = scope.incomeAccountOptions.concat(scope.liabilityAccountOptions);

                if (data.chargeAppliesTo.value === "Loan") {
                    scope.chargeTimeTypeOptions = data.loanChargeTimeTypeOptions;
                    scope.template.chargeCalculationTypeOptions = scope.template.loanChargeCalculationTypeOptions;
                    scope.flag = false;
                    scope.showFrequencyOptions = true;
                    scope.glimChargeCalculationTypeOptions = data.glimChargeCalculationTypeOptions || [];
                } else if (data.chargeAppliesTo.value === "Savings") {
                    scope.chargeTimeTypeOptions = data.savingsChargeTimeTypeOptions;
                    scope.template.chargeCalculationTypeOptions = scope.template.savingsChargeCalculationTypeOptions;
                    scope.flag = true;
                    scope.showFrequencyOptions = false;
                }else if(data.chargeAppliesTo.value === 'Shares') {
                    scope.showChargePaymentByField = false;
                    scope.chargeCalculationTypeOptions = scope.template.shareChargeCalculationTypeOptions;
                    scope.chargeTimeTypeOptions = scope.template.shareChargeTimeTypeOptions;
                    scope.addfeefrequency = false;
                    scope.showGLAccount = false;
                    scope.showPenalty = false ;
                }else {
                    scope.flag = true;
                    scope.template.chargeCalculationTypeOptions = data.clientChargeCalculationTypeOptions;
                    scope.chargeTimeTypeOptions = scope.template.clientChargeTimeTypeOptions;
                    scope.showFrequencyOptions = false;
                    scope.showGLAccount = true;
                }

                scope.formData = {
                    name: data.name,
                    active: data.active,
                    penalty: data.penalty,
                    currencyCode: data.currency.code,
                    chargeAppliesTo: data.chargeAppliesTo.id,
                    chargeTimeType: data.chargeTimeType.id,
                    chargeCalculationType: data.chargeCalculationType.id,
                    amount: data.amount,
                    minCap: data.minCap,
                    maxCap: data.maxCap,
                    emiRoundingGoalSeek: data.emiRoundingGoalSeek,
                    isGlimCharge: data.isGlimCharge,
                    glimChargeCalculation: data.glimChargeCalculation.id,
                    slabs: data.slabs,
                    isCapitalized: data.isCapitalized
                };

                if(data.chargeCalculationType.id == 6) {
                    scope.showSlabBasedCharges = true;
                } else {
                    scope.showSlabBasedCharges = false;
                }

                if(data.incomeOrLiabilityAccount){
                    scope.formData.incomeAccountId = data.incomeOrLiabilityAccount.id;
                }

                if(data.taxGroup){
                    scope.formData.taxGroupId = data.taxGroup.id;
                }

                if(data.feeFrequency){
                    scope.addfeefrequency = 'true';
                    scope.formData.feeFrequency = data.feeFrequency.id;
                    scope.formData.feeInterval = data.feeInterval;
                }

                //when chargeAppliesTo is savings, below logic is
                //to display 'Due date' field, if chargeTimeType is
                // 'annual fee' or 'monthly fee'
                if (scope.formData.chargeAppliesTo === 2 || scope.formData.chargeAppliesTo === 3) {
                    if (data.chargeTimeType.value === "Annual Fee" || data.chargeTimeType.value === "Monthly Fee") {
                        scope.showdatefield = true;
                        if (data.feeOnMonthDay) {
                            data.feeOnMonthDay.push(2013);
                            var actDate = dateFilter(data.feeOnMonthDay, 'dd MMMM');
                            scope.first.date = new Date(actDate);
                            //to display "Repeats Every" field ,if chargeTimeType is
                            // 'monthly fee'
                            if (data.chargeTimeType.value === "Monthly Fee") {
                                scope.repeatEvery = true;
                                scope.formData.feeInterval = data.feeInterval;
                            } else {
                                scope.repeatEvery = false;
                            }
                        }
                    } else {
                        scope.showdatefield = false;
                    }
                } else {
                    scope.formData.chargePaymentMode = data.chargePaymentMode.id;
                }
            });
            //when chargeAppliesTo is savings, below logic is
            //to display 'Due date' field, if chargeTimeType is
            // 'annual fee' or 'monthly fee'
            scope.chargeTimeChange = function (chargeTimeType) {
		if ((chargeTimeType === 12) && (scope.template.chargeAppliesTo.value === "Loan"))
		{
			scope.showFrequencyOptions = false;
		}
		else
		{
			scope.showFrequencyOptions = true;
		}
                if (scope.formData.chargeAppliesTo === 2 || scope.formData.chargeAppliesTo === 3) {
                    for (var i in scope.template.chargeTimeTypeOptions) {
                        if (chargeTimeType === scope.template.chargeTimeTypeOptions[i].id) {
                            if (scope.template.chargeTimeTypeOptions[i].value == "Annual Fee" || scope.template.chargeTimeTypeOptions[i].value == "Monthly Fee") {
                                scope.showdatefield = true;
                                //to show 'repeats every' field for monthly fee
                                if (scope.template.chargeTimeTypeOptions[i].value == "Monthly Fee") {
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

            scope.chargeCalculationType = function (chargeCalculationType) {
                if(chargeCalculationType == 6) {
                    scope.showSlabBasedCharges = true;
                    scope.formData.amount = undefined;
                } else {
                    scope.showSlabBasedCharges = false;
                    scope.formData.slabs = [];
                }
            }

            scope.addSlabCharge = function (slab) {
                if(slab.fromLoanAmount != undefined && slab.toLoanAmount != undefined && slab.amount != undefined) {
                    var slabCharge = {"fromLoanAmount" : slab.fromLoanAmount, "toLoanAmount" : slab.toLoanAmount, "amount": slab.amount};
                    if( scope.formData.slabs == undefined) {
                        scope.formData.slabs = [];
                    }
                    scope.formData.slabs.push(slabCharge);
                }
            }

            scope.deleteSlabCharge = function (index) {
                scope.formData.slabs.splice(index, 1);
            }

            scope.submit = function () {
                if (scope.formData.chargeAppliesTo === 2 || scope.formData.chargeAppliesTo === 3) {
                    if (scope.showdatefield === true) {
                        var reqDate = dateFilter(scope.first.date, 'dd MMMM');
                        this.formData.monthDayFormat = 'dd MMM';
                        this.formData.feeOnMonthDay = reqDate;
                    }
                }else if(scope.addfeefrequency == 'false'){
                    scope.formData.feeFrequency = null;
                    scope.formData.feeInterval = null;
                }
                if(this.formData.minCap == undefined) {
                    this.formData.minCap = null;
                }
                if(this.formData.maxCap == undefined) {
                    this.formData.maxCap = null;
                }
                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.penalty = this.formData.penalty || false;
                resourceFactory.chargeResource.update({chargeId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewcharge/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditChargeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditChargeController]).run(function ($log) {
        $log.info("EditChargeController initialized");
    });
}(mifosX.controllers || {}));
