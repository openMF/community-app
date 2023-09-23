(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateChargeController: function (scope, resourceFactory, location, dateFilter, translate) {
            scope.template = [];
            scope.formData = {};
            scope.first = {};
            scope.isCollapsed = true;
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first.date = new Date();
            scope.translate = translate;
            scope.showFrequencyOptions = false;
            scope.showPenalty = true ;
            scope.showfreewithdrawalfrequency = false;
            scope.showrestartfrequency = false;
            scope.paymentTypes = [];

            resourceFactory.chargeTemplateResource.get(function (data) {
                scope.template = data;
                scope.showChargePaymentByField = true;
                scope.chargeCalculationTypeOptions = data.chargeCalculationTypeOptions;
                scope.chargeTimeTypeOptions = data.chargeTimeTypeOptions;

                scope.incomeAccountOptions = data.incomeOrLiabilityAccountOptions.incomeAccountOptions || [];
                scope.liabilityAccountOptions = data.incomeOrLiabilityAccountOptions.liabilityAccountOptions || [];
                scope.incomeAndLiabilityAccountOptions = scope.incomeAccountOptions.concat(scope.liabilityAccountOptions);

                scope.assetAccountOptions = data.assetAccountOptions || [];
                scope.expenseAccountOptions = data.expenseAccountOptions;
                scope.accountMappingForChargeConfig = data.accountMappingForChargeConfig;
                scope.accountMappingForCharge = [];
                
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
            });

            scope.chargeAppliesToSelected = function (chargeAppliesId) {
                switch(chargeAppliesId) {
                    case 1:
                        scope.showChargePaymentByField = true;
                        scope.chargeCalculationTypeOptions = scope.template.loanChargeCalculationTypeOptions;
                        scope.chargeTimeTypeOptions = scope.template.loanChargeTimeTypeOptions;
                        scope.showGLAccount = false;
                        break ;
                    case 2:
                        scope.showChargePaymentByField = false;
                        scope.chargeCalculationTypeOptions = scope.template.savingsChargeCalculationTypeOptions;
                        scope.chargeTimeTypeOptions = scope.template.savingsChargeTimeTypeOptions;
                        scope.addfeefrequency = false;
                        scope.showGLAccount = true;
                        break ;
                    case 3:
                        scope.showChargePaymentByField = false;
                        scope.chargeCalculationTypeOptions = scope.template.clientChargeCalculationTypeOptions;
                        scope.chargeTimeTypeOptions = scope.template.clientChargeTimeTypeOptions;
                        scope.addfeefrequency = false;
                        scope.showGLAccount = true;
                        break ;
                    case 4:
                        scope.showChargePaymentByField = false;
                        scope.chargeCalculationTypeOptions = scope.template.shareChargeCalculationTypeOptions;
                        scope.chargeTimeTypeOptions = scope.template.shareChargeTimeTypeOptions;
                        scope.addfeefrequency = false;
                        scope.showGLAccount = false;
                        scope.showPenalty = false ;
                            break ;
                }
                
                
            }
            //when chargeAppliesTo is savings, below logic is
            //to display 'Due date' field, if chargeTimeType is
            //'annual fee' or 'monthly fee'
            scope.chargeTimeChange = function (chargeTimeType) {
                scope.showFrequencyOptions = false;
                if(chargeTimeType == 9){
                    scope.showFrequencyOptions = true;
                }
                if (scope.showChargePaymentByField === false) {
                    for (var i in scope.chargeTimeTypeOptions) {
                        if (chargeTimeType === scope.chargeTimeTypeOptions[i].id) {
                            if (scope.chargeTimeTypeOptions[i].value == "Annual Fee" || scope.chargeTimeTypeOptions[i].value == "Monthly Fee") {
                                scope.showdatefield = true;
                                scope.showenablefreewithdrawal = false;
                                scope.showenablepaymenttype = false;
                                scope.repeatsEveryLabel = 'label.input.months';
                                //to show 'repeats every' field for monthly fee
                                if (scope.chargeTimeTypeOptions[i].value == "Monthly Fee") {
                                    scope.repeatEvery = true;
                                } else {
                                    scope.repeatEvery = false;
                                }
                            } else if (scope.chargeTimeTypeOptions[i].value == "Weekly Fee") {
                                scope.repeatEvery = true;
                                scope.showdatefield = false;
                                scope.repeatsEveryLabel = 'label.input.weeks';
                                scope.showenablefreewithdrawal = false;
                                scope.showenablepaymenttype = false;
                            }
                            else if (scope.chargeTimeTypeOptions[i].value == "Withdrawal Fee") {
                                scope.showenablefreewithdrawal = true;
                                scope.showenablepaymenttype = true;
                            }
                            else{
                                scope.showenablefreewithdrawal = false;
                                scope.showenablepaymenttype = false;
                                scope.showdatefield = false;
                                scope.repeatEvery = false;
                            }
                            }


                        }
                    }

            }

            resourceFactory.paymentTypeResource.getAll( function (data) {
                scope.paymentTypes = data;
            });

            resourceFactory.loanProductResource.get({resourceType: 'template'}, function (data) {
                scope.product = data;
                const i = 1;
                scope.filteredItems = scope.product.repaymentFrequencyTypeOptions.slice(0, i).concat(scope.product.repaymentFrequencyTypeOptions.slice(i + 1, scope.product.repaymentFrequencyTypeOptions.length));
            })

            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }

                if(this.formData.enablepaymenttypes){
                    scope.choice = 1;
                }else if(!this.formData.enablepaymenttypes){
                    scope.choice = 0;
                }
            };

            scope.setOptions = function() {
                if (this.formData.enableFreeWithdrawalCharge) {
                    scope.showfreewithdrawalfrequency = true;
                    scope.showrestartfrequency = true;

                } else if (!this.formData.enableFreeWithdrawalCharge) {
                    scope.showfreewithdrawalfrequency = false;
                    scope.showrestartfrequency = false;
                }

                if(this.formData.enablePaymentType){
                    scope.showpaymenttype = true;
                }else if(!this.formData.enablePaymentType){
                    scope.showpaymenttype = false;
                }
            };

            scope.hideweek = function(){
                return this.formData.countFrequencyType.id !==1;
            };

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
            scope.submit = function () {
                //when chargeTimeType is 'annual' or 'monthly fee' then feeOnMonthDay added to
                //the formData
                if (scope.showChargePaymentByField === false) {
                    if (scope.showdatefield === true) {
                        var reqDate = dateFilter(scope.first.date, 'dd MMMM');
                        this.formData.monthDayFormat = 'dd MMM';
                        this.formData.feeOnMonthDay = reqDate;
                    }
                }

                if( (scope.formData.chargeAppliesTo === 1 || scope.formData.chargeAppliesTo === 3 )&& scope.addfeefrequency == 'false'){
                    scope.formData.feeFrequency = null;
                    scope.formData.feeInterval = null;
                }

                if (!scope.showChargePaymentByField) {
                    delete this.formData.chargePaymentMode;
                }
                this.formData.active = this.formData.active || false;
                this.formData.enableFreeWithdrawalCharge = this.formData.enableFreeWithdrawalCharge || false;
                this.formData.enablePaymentType = this.formData.enablePaymentType || false;
                this.formData.locale = scope.optlang.code;
                this.formData.monthDayFormat = 'dd MMM';
                resourceFactory.chargeResource.save(this.formData, function (data) {
                    location.path('/viewcharge/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateChargeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.CreateChargeController]).run(function ($log) {
        $log.info("CreateChargeController initialized");
    });
}(mifosX.controllers || {}));
