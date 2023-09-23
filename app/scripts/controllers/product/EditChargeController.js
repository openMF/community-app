(function (module) {
    mifosX.controllers = _.extend(module, {
        EditChargeController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.template = [];
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first = {};
            scope.flag = false;
	        scope.showPenalty = true ;
            scope.paymentTypeOptions = [];

            resourceFactory.chargeResource.getCharge({chargeId: routeParams.id, template: true}, function (data) {
                scope.template = data;
                scope.incomeAccountOptions = data.incomeOrLiabilityAccountOptions.incomeAccountOptions || [];
                scope.liabilityAccountOptions = data.incomeOrLiabilityAccountOptions.liabilityAccountOptions || [];
                scope.incomeAndLiabilityAccountOptions = scope.incomeAccountOptions.concat(scope.liabilityAccountOptions);
                scope.assetAccountOptions = data.assetAccountOptions || [];
                scope.expenseAccountOptions = data.expenseAccountOptions;
                scope.accountMappingForChargeConfig = data.accountMappingForChargeConfig;
                scope.accountMappingForCharge= [];
                
                var accountMappingForChargeConfigVar = scope.accountMappingForChargeConfig.toLowerCase();

                if(accountMappingForChargeConfigVar.indexOf("asset") > -1){
                    scope.accountMappingForCharge = scope.accountMappingForCharge.concat(scope.assetAccountOptions);
                }
                if(accountMappingForChargeConfigVar.indexOf("liability") > -1){
                    scope.accountMappingForCharge = scope.accountMappingForCharge.concat(scope.liabilityAccountOptions);
                }
               if(accountMappingForChargeConfigVar.indexOf("expense") > -1){
                    scope.accountMappingForCharge = scope.accountMappingForCharge.concat(scope.expenseAccountOptions);
                }
               if(accountMappingForChargeConfigVar.indexOf("income") > -1){
                    scope.accountMappingForCharge = scope.accountMappingForCharge.concat(scope.incomeAccountOptions);
                }

                if (data.chargeAppliesTo.value === "Loan") {
                    scope.chargeTimeTypeOptions = data.loanChargeTimeTypeOptions;
                    scope.template.chargeCalculationTypeOptions = scope.template.loanChargeCalculationTypeOptions;
                    scope.flag = false;
                    scope.showFrequencyOptions = true;
                } else if (data.chargeAppliesTo.value === "Savings") {
                    scope.chargeTimeTypeOptions = data.savingsChargeTimeTypeOptions;
                    scope.template.chargeCalculationTypeOptions = scope.template.savingsChargeCalculationTypeOptions;
                    scope.paymentTypeOptions = data.paymentTypeOptions;
                    scope.flag = true;
                    scope.showFrequencyOptions = false;
                    scope.showGLAccount = true;
                    resourceFactory.paymentTypeResource.getAll( function (data) {
                        scope.paymentTypeOptions = data;
                    });

                    if(data.freeWithdrawal === true) {
                        scope.showenablefreewithdrawal = true;
                        scope.showpaymenttype = true;
                        scope.showfreewithdrawalfrequency = true;
                        scope.showrestartfrequency = true;
                        scope.enableFreeWithdrawalCharge = true;
                    }
                    else{
                        scope.showenablefreewithdrawal = true;
                        scope.showpaymenttype = true;
                    }
                    if(data.isPaymentType === true){
                        scope.showenablepaymenttype = true;
                        scope.enablePaymentType = true;
                    }
                    else{
                        scope.showenablepaymenttype = true;
                        scope.enablePaymentType = false;
                        scope.showpaymenttype = false;
                    }

                } else if(data.chargeAppliesTo.value === 'Shares') {
                    scope.showChargePaymentByField = false;
                    scope.chargeCalculationTypeOptions = scope.template.shareChargeCalculationTypeOptions;
                    scope.chargeTimeTypeOptions = scope.template.shareChargeTimeTypeOptions;
                    scope.addfeefrequency = false;
                    scope.showGLAccount = false;
                    scope.showPenalty = false ;
                    scope.flag = true;
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
                    enableFreeWithdrawalCharge: data.freeWithdrawal,
                    enablePaymentType: data.isPaymentType,
                    freeWithdrawalFrequency:data.freeWithdrawalChargeFrequency,
                    restartCountFrequency: data.restartFrequency,
                    countFrequencyType: data.restartFrequencyEnum,
                    penalty: data.penalty,
                    currencyCode: data.currency.code,
                    chargeAppliesTo: data.chargeAppliesTo.id,
                    chargeTimeType: data.chargeTimeType.id,
                    chargeCalculationType: data.chargeCalculationType.id,
                    amount: data.amount
                };
                if(data.incomeOrLiabilityAccount){
                    scope.formData.incomeAccountId = data.incomeOrLiabilityAccount.id;   
                }

                if(data.paymentTypeOptions){
                    scope.formData.paymentTypeId = data.paymentTypeOptions.id;
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
                if (scope.formData.chargeAppliesTo === 2) {
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
                if (scope.formData.chargeAppliesTo === 2) {
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

            scope.filterChargeCalculations = function(chargeTimeType) {
                return function (item) {
                    if (chargeTimeType == 12 && ((item.id == 3) || (item.id == 4)))
                    {
                        return false;
                    }
                    if (chargeTimeType != 12 && item.id == 5)
                    {
                        return false;
                    }
                    return true;
                };
            };

            resourceFactory.loanProductResource.get({resourceType: 'template'}, function (data) {
                scope.product = data;

                const i = 1;
                scope.filteredItems = scope.product.repaymentFrequencyTypeOptions.slice(0, i).concat(scope.product.repaymentFrequencyTypeOptions.slice(i + 1, scope.product.repaymentFrequencyTypeOptions.length));
            });

            scope.setOptions = function() {
                if (this.formData.enableFreeWithdrawalCharge) {
                    scope.showfreewithdrawalfrequency = true;
                    scope.showrestartfrequency = true;

                } else if (!this.formData.freewithdrawal) {
                    scope.showfreewithdrawalfrequency = false;
                    scope.showrestartfrequency = false;
                }

                if(this.formData.enablePaymentType){
                    scope.showpaymenttype = true;
                    scope.showenablepaymenttype = true;
                }
                else if(!this.formData.enablePaymentType){
                    scope.showpaymenttype = false;
                    scope.showenablepaymenttype = true;
                }
            };

            scope.submit = function () {
                if (scope.formData.chargeAppliesTo === 2) {
                    if (scope.showdatefield === true) {
                        var reqDate = dateFilter(scope.first.date, 'dd MMMM');
                        this.formData.monthDayFormat = 'dd MMM';
                        this.formData.feeOnMonthDay = reqDate;
                    }
                }else if(scope.addfeefrequency == 'false'){
                    scope.formData.feeFrequency = null;
                    scope.formData.feeInterval = null;
                }
                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.enableFreeWithdrawalCharge = this.formData.enableFreeWithdrawalCharge || false;
                this.formData.enablePaymentType = this.formData.enablePaymentType || false;
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
