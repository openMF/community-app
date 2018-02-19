(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateSavingAccountController: function (scope, $rootScope, resourceFactory, location, routeParams, dateFilter,WizardHandler) {
            scope.products = [];
            scope.fieldOfficers = [];
            scope.formData = {};
            scope.formDat = {};
            scope.savingdetails = {};
            scope.restrictDate = new Date();
            scope.clientId = routeParams.clientId;
            scope.groupId = routeParams.groupId;
			scope.date = {};
			scope.date.submittedOnDate = new Date();
            scope.datatables = [];
            scope.noOfTabs = 1;
            scope.step = '-';
            scope.formData.datatables = [];
            scope.formDat.datatables = [];
            scope.tf = "HH:mm";
            scope.tempDataTables = [];
            scope.disabled = true;

            if (routeParams.centerEntity) {
                scope.centerEntity = true;
            }
            scope.charges = [];
            scope.inparams = {};
            if (scope.clientId) {
                scope.inparams.clientId = scope.clientId
            }

            if (scope.groupId) {
                scope.inparams.groupId = scope.groupId
            }

            if (scope.centerId) {
                scope.inparams.centerId = scope.centerId
            }


            scope.inparams.staffInSelectedOfficeOnly = true;
            
            resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                scope.chargeOptions = data.chargeOptions;
                scope.clientName = data.clientName;
                scope.groupName = data.groupName;
            });

            scope.handleDatatables = function (datatables) {
                if (!_.isUndefined(datatables) && datatables.length > 0) {
                    scope.formData.datatables = [];
                    scope.formDat.datatables = [];
                    scope.noOfTabs = datatables.length + 1;
                    angular.forEach(datatables, function (datatable, index) {
                        scope.updateColumnHeaders(datatable.columnHeaderData);
                        angular.forEach(datatable.columnHeaderData, function (colHeader, i) {
                            if (_.isEmpty(scope.formDat.datatables[index])) {
                                scope.formDat.datatables[index] = {data: {}};
                            }

                            if (_.isEmpty(scope.formData.datatables[index])) {
                                scope.formData.datatables[index] = {
                                    registeredTableName: datatable.registeredTableName,
                                    data: {locale: scope.optlang.code}
                                };
                            }

                            if (datatable.columnHeaderData[i].columnDisplayType == 'DATETIME') {
                                scope.formDat.datatables[index].data[datatable.columnHeaderData[i].columnName] = {};
                            }
                        });
                    });
                }
            };

            scope.goNext = function(form){
                WizardHandler.wizard().checkValid(form);
            }

            scope.updateColumnHeaders = function(columnHeaderData) {
                var colName = columnHeaderData[0].columnName;
                if (colName == 'id') {
                    columnHeaderData.splice(0, 1);
                }

                colName = columnHeaderData[0].columnName;
                if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                    columnHeaderData.splice(0, 1);
                }
            };

            scope.formValue = function(array,model,findattr,retAttr){
                findattr = findattr ? findattr : 'id';
                retAttr = retAttr ? retAttr : 'value';
                console.log(findattr,retAttr,model);
                return _.find(array, function (obj) {
                    return obj[findattr] === model;
                })[retAttr];
            };

            scope.changeProduct = function () {
                // _.isUndefined(scope.datatables) ? scope.tempDataTables = [] : scope.tempDataTables = scope.datatables;
                scope.inparams.productId = scope.formData.productId;
                resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {

                    scope.data = data;
                    scope.charges = data.charges;

                    for (var i in scope.charges) {
                        if (scope.charges[i].chargeTimeType.value === "Annual Fee" && scope.charges[i].feeOnMonthDay) {
                            scope.charges[i].feeOnMonthDay.push('2013');
                            scope.charges[i].feeOnMonthDay = new Date(dateFilter(scope.charges[i].feeOnMonthDay, scope.df));
                        }
                    }
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
                    scope.datatables = data.datatables;
                    scope.handleDatatables(scope.datatables);
                    scope.disabled = false;
                    scope.savingdetails = angular.copy(scope.formData);
                    scope.savingdetails.productName = scope.formValue(scope.products,scope.formData.productId,'id','name');
                });
            };

            scope.$watch('formData',function(newVal){
               scope.savingdetails = angular.extend(scope.savingdetails,newVal);
            });

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

            //return input type
            scope.fieldType = function (type) {
                var fieldType = "";
                if (type) {
                    if (type == 'CODELOOKUP' || type == 'CODEVALUE') {
                        fieldType = 'SELECT';
                    } else if (type == 'DATE') {
                        fieldType = 'DATE';
                    } else if (type == 'DATETIME') {
                        fieldType = 'DATETIME';
                    } else if (type == 'BOOLEAN') {
                        fieldType = 'BOOLEAN';
                    } else {
                        fieldType = 'TEXT';
                    }
                }
                return fieldType;
            };

            scope.submit = function () {
                if (scope.date) {
                    this.formData.submittedOnDate = dateFilter(scope.date.submittedOnDate, scope.df);
                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.monthDayFormat = "dd MMM";
                this.formData.charges = [];

                if (scope.clientId) this.formData.clientId = scope.clientId;
                if (scope.groupId) this.formData.groupId = scope.groupId;
                if (scope.centerId) this.formData.centerId = scope.centerId;

                if (scope.charges.length > 0) {

                    for (var i in scope.charges) {
                        
                        if (scope.charges[i].chargeTimeType.value == 'Annual Fee') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                feeOnMonthDay: dateFilter(scope.charges[i].feeOnMonthDay, 'dd MMMM')});
                        } else if (scope.charges[i].chargeTimeType.value == 'Specified due date') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                dueDate: dateFilter(scope.charges[i].dueDate, scope.df)});
                        } else if (scope.charges[i].chargeTimeType.value == 'Monthly Fee') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                feeOnMonthDay: dateFilter(scope.charges[i].feeOnMonthDay, 'dd MMMM'), feeInterval: scope.charges[i].feeInterval});
                        } else if (scope.charges[i].chargeTimeType.value == 'Weekly Fee') {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount, dueDate: dateFilter(scope.charges[i].dueDate, scope.df), feeInterval: scope.charges[i].feeInterval});                            
                        }
                        else {
                            this.formData.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount});
                        }
                    }
                }

                if (!_.isUndefined(scope.datatables) && scope.datatables.length > 0) {
                    angular.forEach(scope.datatables, function (datatable, index) {
                        scope.columnHeaders = datatable.columnHeaderData;
                        angular.forEach(scope.columnHeaders, function (colHeader, i) {
                            scope.dateFormat = scope.df + " " + scope.tf
                            if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName])) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName],
                                        scope.dateFormat);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            } else if (scope.columnHeaders[i].columnDisplayType == 'DATETIME') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date) && !_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time)) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date, scope.df)
                                        + " " + dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time, scope.tf);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            }
                        });
                    });
                } else {
                    delete scope.formData.datatables;
                }

                resourceFactory.savingsResource.save(this.formData, function (data) {
                    location.path('/viewsavingaccount/' + data.savingsId);
                });
            };

            scope.cancel = function () {
                if (scope.clientId) {
                    location.path('/viewclient/' + scope.clientId);
                } else if (scope.centerEntity) {
                    location.path('/viewcenter/' + scope.groupId);
                } else {
                    location.path('/viewgroup/' + scope.groupId);
                }
            }
        }
    });
    mifosX.ng.application.controller('CreateSavingAccountController', ['$scope','$rootScope','ResourceFactory', '$location', '$routeParams', 'dateFilter', 'WizardHandler',mifosX.controllers.CreateSavingAccountController]).run(function ($log) {
        $log.info("CreateSavingAccountController initialized");
    });
}(mifosX.controllers || {}));
