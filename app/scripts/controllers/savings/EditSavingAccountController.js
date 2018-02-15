(function (module) {
    mifosX.controllers = _.extend(module, {
        EditSavingAccountController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.products = [];
            scope.fieldOfficers = [];
            scope.formData = {};
            scope.accountId = routeParams.id;
            scope.charges = [];
            scope.restrictDate = new Date();
            resourceFactory.savingsResource.get({accountId: scope.accountId, template: 'true', associations: 'charges',staffInSelectedOfficeOnly:'true'}, function (data) {
                scope.data = data;
                scope.charges = data.charges || [];
                if (scope.charges) {
                    for (var i in scope.charges) {
                        if (scope.charges[i].chargeTimeType.value == 'Annual Fee') {
                            scope.charges[i].feeOnMonthDay.push(2013);
                            scope.charges[i].feeOnMonthDay = new Date(dateFilter(scope.charges[i].feeOnMonthDay, scope.df));
                        } else if (scope.charges[i].chargeTimeType.value == "Monthly Fee") {
                            scope.charges[i].feeOnMonthDay.push(2013);
                            scope.charges[i].feeOnMonthDay = new Date(dateFilter(scope.charges[i].feeOnMonthDay, scope.df));
                        } else if (scope.charges[i].chargeTimeType.value == 'Specified due date') {
                            scope.charges[i].dueDate = new Date(dateFilter(scope.charges[i].dueDate, scope.df));
                        } else if (scope.charges[i].chargeTimeType.value == 'Weekly Fee') {
                            scope.charges[i].dueDate = new Date(dateFilter(scope.charges[i].dueDate, scope.df));
                        }
                    }
                }

                if (data.clientId) {
                    scope.formData.clientId = data.clientId;
                    scope.clientName = data.clientName;
                }
                if (data.groupId) {
                    scope.formData.groupId = data.groupId;
                    scope.groupName = data.groupName;
                }
                scope.formData.productId = data.savingsProductId;
                scope.products = data.productOptions;
                if (data.fieldOfficerId != 0)scope.formData.fieldOfficerId = data.fieldOfficerId;
                if (data.timeline) {
                    var submittedOnDate = dateFilter(data.timeline.submittedOnDate, scope.df);
                    scope.formData.submittedOnDate = new Date(submittedOnDate);
                }
                scope.formData.externalId = data.externalId;
                scope.fieldOfficers = data.fieldOfficerOptions;
                scope.formData.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
                scope.formData.minRequiredOpeningBalance = data.minRequiredOpeningBalance;
                scope.formData.lockinPeriodFrequency = data.lockinPeriodFrequency;
                /* FIX-ME: uncomment annualFeeAmount when datepicker avialable, because it depends on the date field 'annualFeeOnMonthDay'*/
                //scope.formData.annualFeeAmount = data.annualFeeAmount;
                scope.formData.withdrawalFeeAmount = data.withdrawalFeeAmount;
                scope.formData.withdrawalFeeForTransfers = data.withdrawalFeeForTransfers;
                scope.formData.allowOverdraft = data.allowOverdraft;
                scope.formData.overdraftLimit = data.overdraftLimit;
                scope.formData.nominalAnnualInterestRateOverdraft = data.nominalAnnualInterestRateOverdraft;
                scope.formData.minOverdraftForInterestCalculation = data.minOverdraftForInterestCalculation;
                scope.formData.enforceMinRequiredBalance = data.enforceMinRequiredBalance;
                scope.formData.minRequiredBalance = data.minRequiredBalance;
                scope.formData.withHoldTax = data.withHoldTax;

                if (data.interestCompoundingPeriodType) scope.formData.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
                if (data.interestPostingPeriodType) scope.formData.interestPostingPeriodType = data.interestPostingPeriodType.id;
                if (data.interestCalculationType) scope.formData.interestCalculationType = data.interestCalculationType.id;
                if (data.interestCalculationDaysInYearType) scope.formData.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
                if (data.lockinPeriodFrequencyType) scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
                if (data.withdrawalFeeType) scope.formData.withdrawalFeeType = data.withdrawalFeeType.id;

            });

            scope.changeProduct = function () {
                var inparams = {productId: scope.formData.productId};
                if (scope.formData.clientId) inparams.clientId = scope.formData.clientId;
                if (scope.formData.groupId) inparams.groupId = scope.formData.groupId;
                resourceFactory.savingsTemplateResource.get(inparams, function (data) {

                    scope.data = data;

                    scope.fieldOfficers = data.fieldOfficerOptions;
                    scope.formData.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
                    scope.formData.minRequiredOpeningBalance = data.minRequiredOpeningBalance;
                    scope.formData.lockinPeriodFrequency = data.lockinPeriodFrequency;
                    /* FIX-ME: uncomment annualFeeAmount when datepicker avialable, because it depends on the date field 'annualFeeOnMonthDay'*/
                    //scope.formData.annualFeeAmount = data.annualFeeAmount;
                    scope.formData.withdrawalFeeAmount = data.withdrawalFeeAmount;
                    scope.formData.withdrawalFeeForTransfers = data.withdrawalFeeForTransfers;
                    scope.formData.withHoldTax = data.withHoldTax;

                    if (data.interestCompoundingPeriodType) scope.formData.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
                    if (data.interestPostingPeriodType) scope.formData.interestPostingPeriodType = data.interestPostingPeriodType.id;
                    if (data.interestCalculationType) scope.formData.interestCalculationType = data.interestCalculationType.id;
                    if (data.interestCalculationDaysInYearType) scope.formData.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
                    if (data.lockinPeriodFrequencyType) scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
                    if (data.withdrawalFeeType) scope.formData.withdrawalFeeType = data.withdrawalFeeType.id;

                });
            }

            scope.addCharge = function (chargeId) {
                scope.errorchargeevent = false;
                if (chargeId) {
                    resourceFactory.chargeResource.get({chargeId: chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        if (data.chargeTimeType.value == "Annual Fee") {
                            if (data.feeOnMonthDay) {
                                data.feeOnMonthDay.push(2013);
                                data.feeOnMonthDay = new Date(dateFilter(data.feeOnMonthDay, scope.df));
                            }
                        } else if (data.chargeTimeType.value == "Monthly Fee") {
                            if (data.feeOnMonthDay) {
                                data.feeOnMonthDay.push(2013);
                                data.feeOnMonthDay = new Date(dateFilter(data.feeOnMonthDay, scope.df));
                            }
                        }

                        delete data.id;
                        scope.charges.push(data);
                        scope.chargeId = undefined;
                    });
                } else {
                    scope.errorchargeevent = true;
                    scope.labelchargeerror = "selectcharge";
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

            scope.cancel = function () {
                location.path('/viewsavingaccount/' + scope.accountId);
            }

            scope.submit = function () {
                if (this.formData.submittedOnDate)  this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.monthDayFormat = "dd MMM";
                scope.formData.charges = [];
                if (scope.charges.length > 0) {
                    for (var i in scope.charges) {
                        if (scope.charges[i].chargeTimeType.value == 'Annual Fee') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                feeOnMonthDay: dateFilter(scope.charges[i].feeOnMonthDay, 'dd MMMM')});
                        } else if (scope.charges[i].chargeTimeType.value == 'Specified due date') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                dueDate: dateFilter(scope.charges[i].dueDate, scope.df)});
                        } else if (scope.charges[i].chargeTimeType.value == 'Weekly Fee') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                dueDate: dateFilter(scope.charges[i].dueDate, scope.df), feeInterval: scope.charges[i].feeInterval});
                        } else if (scope.charges[i].chargeTimeType.value == 'Monthly Fee') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                feeOnMonthDay: dateFilter(scope.charges[i].feeOnMonthDay, 'dd MMMM'), feeInterval: scope.charges[i].feeInterval});
                        } else {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount});
                        }
                    }
                }

                resourceFactory.savingsResource.update({'accountId': scope.accountId}, this.formData, function (data) {
                    location.path('/viewsavingaccount/' + data.savingsId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditSavingAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditSavingAccountController]).run(function ($log) {
        $log.info("EditSavingAccountController initialized");
    });
}(mifosX.controllers || {}));
