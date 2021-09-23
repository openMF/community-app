(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateChargeController: function (scope, resourceFactory, location, dateFilter, translate) {
            scope.template = [];
            scope.formData = {
              subCharges: []
            };
            scope.first = {};
            scope.isCollapsed = true;
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first.date = new Date();
            scope.translate = translate;
            scope.showFrequencyOptions = false;
            scope.showPenalty = true ;
            scope.available = [];
            scope.selected = [];
            scope.selectedCharges = [] ;
            scope.availableCharges = [];

            resourceFactory.chargeTemplateResource.get(function (data) {
                scope.template = data;
                scope.showChargePaymentByField = true;
                scope.chargeCalculationTypeOptions = data.chargeCalculationTypeOptions;
                scope.chargeTimeTypeOptions = data.chargeTimeTypeOptions;

                scope.incomeAccountOptions = data.incomeOrLiabilityAccountOptions.incomeAccountOptions || [];
                scope.liabilityAccountOptions = data.incomeOrLiabilityAccountOptions.liabilityAccountOptions || [];
                scope.incomeAndLiabilityAccountOptions = scope.incomeAccountOptions.concat(scope.liabilityAccountOptions);
                scope.availableCharges = data.subCharges || [];
            });

            // Add Charges

            scope.addCharge = function() {
              for (var i in this.available){
                for (var j in scope.availableCharges){
                  if (scope.availableCharges[j].id == this.available[i]) {
                      var temp = {};
                      temp.id = this.available[i];
                      temp.name = scope.availableCharges[j].name;
                      scope.selectedCharges.push(temp);
                      scope.availableCharges.splice(j, 1);
                  }
                }
              }

              for (var i in this.available) {
                  for (var j in scope.selectedCharges) {
                      if (scope.selectedCharges[j].id == this.available[i]) {
                          scope.available.splice(i, 1);
                      }
                  }
              }
            }

            scope.removeCharge = function () {
                for (var i in this.selected) {
                    for (var j in scope.selectedCharges) {
                        if (scope.selectedCharges[j].id == this.selected[i]) {
                            var temp = {};
                            temp.id = this.selected[i];
                            temp.name = scope.selectedCharges[j].name;
                            scope.availableCharges.push(temp);
                            scope.selectedCharges.splice(j, 1);
                        }
                    }
                }
                //We need to remove selected items outside of above loop. If we don't remove, we can see empty item appearing
                //If we remove selected items in above loop, all items will not be moved to availableRoles
                for (var i in this.selected) {
                    for (var j in scope.availableCharges) {
                        if (scope.availableCharges[j].id == this.selected[i]) {
                            scope.selected.splice(i, 1);
                        }
                    }
                }
            };

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
                        scope.showGLAccount = false;
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
                            }
                            else {
                                scope.showdatefield = false;
                                scope.repeatEvery = false;
                            }

                        }
                    }
                }
            }

            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
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
                this.formData.locale = scope.optlang.code;
                this.formData.monthDayFormat = 'dd MMM';
                if (scope.selectedCharges.length == 0){
                  delete scope.formData.subCharges;
                } else {
                  for (var i in scope.selectedCharges) {
                      scope.formData.subCharges.push(scope.selectedCharges[i].id) ;
                  }
                }

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
