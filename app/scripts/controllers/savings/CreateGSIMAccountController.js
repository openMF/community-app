(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateGSIMAccountController: function (scope, resourceFactory, location, routeParams, dateFilter, WizardHandler) {
            scope.products = [];
            scope.fieldOfficers = [];
            scope.formData1 = {};
            scope.formData = {};
            scope.formDat = {};
            scope.restrictDate = new Date();
            scope.clientId = routeParams.clientId;
            scope.groupId = routeParams.groupId;
            scope.date = {};
            scope.date.submittedOnDate = new Date();
            scope.datatables = [];
            scope.noOfTabs = 1;
            scope.step = '-';
            scope.formData1.datatables = [];
            scope.formDat.datatables = [];
            scope.tf = "HH:mm";
            scope.tempDataTables = [];
            scope.isAllClientSelected = false;
            scope.group={};
            scope.group.clients=[];

            if (routeParams.centerEntity) {
                scope.centerEntity = true;
            }
            scope.charges = [];
            scope.inparams = {};
            if (scope.clientId) {
                scope.inparams.clientId = scope.clientId
            }
            ;
            if (scope.groupId) {
                scope.inparams.groupId = scope.groupId
            }
            ;
            if (scope.centerId) {
                scope.inparams.centerId = scope.centerId
            }
            ;

            scope.inparams.staffInSelectedOfficeOnly = true;

            resourceFactory.groupClients.get({groupId:scope.groupId,associations:'activeClientMembers'}, function (data) {

                scope.group= data;
                scope.group.clients= data.activeClientMembers;
            });

            scope.checkerInboxAllCheckBoxesMet = function() {
                if(!angular.isUndefined(scope.group.clients)) {
                    var count = 0;
                    for (var i in scope.group.clients) {
                        if(scope.group.clients[i].isSelected){
                            count++;
                        }
                    }
                    scope.isAllClientSelected = (scope.group.clients.length==count);
                    return scope.isAllClientSelected;
                }
            }
            scope.checkerInboxAllCheckBoxesClicked = function() {
                scope.isAllClientSelected = !scope.isAllClientSelected;
                if(!angular.isUndefined(scope.group.clients)) {
                    for (var i in scope.group.clients) {
                        scope.group.clients[i].isSelected = scope.isAllClientSelected;
                    }
                }
            }
            resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                scope.chargeOptions = data.chargeOptions;
                scope.clientName = data.clientName;
                scope.groupName = data.groupName;
                scope.datatables = data.datatables;
                scope.handleDatatables(scope.datatables);
            });

            scope.handleDatatables = function (datatables) {
                if (!_.isUndefined(datatables) && datatables.length > 0) {
                    scope.formData1.datatables = [];
                    scope.formDat.datatables = [];
                    scope.noOfTabs = datatables.length + 1;
                    angular.forEach(datatables, function (datatable, index) {
                        scope.updateColumnHeaders(datatable.columnHeaderData);
                        angular.forEach(datatable.columnHeaderData, function (colHeader, i) {
                            if (_.isEmpty(scope.formDat.datatables[index])) {
                                scope.formDat.datatables[index] = {data: {}};
                            }

                            if (_.isEmpty(scope.formData1.datatables[index])) {
                                scope.formData1.datatables[index] = {
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

            scope.changeProduct = function () {
                _.isUndefined(scope.datatables) ? scope.tempDataTables = [] : scope.tempDataTables = scope.datatables;
                WizardHandler.wizard().removeSteps(1, scope.tempDataTables.length);
                scope.inparams.productId = scope.formData1.productId;
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
                    scope.formData1.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
                    scope.formData1.minRequiredOpeningBalance = data.minRequiredOpeningBalance;
                    scope.formData1.lockinPeriodFrequency = data.lockinPeriodFrequency;
                    scope.formData1.withdrawalFeeAmount = data.withdrawalFeeAmount;
                    scope.formData1.withdrawalFeeForTransfers = data.withdrawalFeeForTransfers;
                    scope.formData1.allowOverdraft = data.allowOverdraft;
                    scope.formData1.overdraftLimit = data.overdraftLimit;
                    scope.formData1.nominalAnnualInterestRateOverdraft = data.nominalAnnualInterestRateOverdraft;
                    scope.formData1.minOverdraftForInterestCalculation = data.minOverdraftForInterestCalculation;
                    scope.formData1.enforceMinRequiredBalance = data.enforceMinRequiredBalance;
                    scope.formData1.minRequiredBalance = data.minRequiredBalance;
                    scope.formData1.withHoldTax = data.withHoldTax;

                    if (data.interestCompoundingPeriodType) scope.formData1.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
                    if (data.interestPostingPeriodType) scope.formData1.interestPostingPeriodType = data.interestPostingPeriodType.id;
                    if (data.interestCalculationType) scope.formData1.interestCalculationType = data.interestCalculationType.id;
                    if (data.interestCalculationDaysInYearType) scope.formData1.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
                    if (data.lockinPeriodFrequencyType) scope.formData1.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
                    if (data.withdrawalFeeType) scope.formData1.withdrawalFeeType = data.withdrawalFeeType.id;
                    scope.datatables = data.datatables;
                    scope.handleDatatables(scope.datatables);
                });
            };

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

            var applicationId= Math.floor((Math.random() * 9999999999) + 1);
            scope.submit = function () {

                if (scope.date) {
                    this.formData1.submittedOnDate = dateFilter(scope.date.submittedOnDate, scope.df);
                }
                this.formData1.locale = scope.optlang.code;
                this.formData1.dateFormat = scope.df;
                this.formData1.monthDayFormat = "dd MMM";
                this.formData1.charges = [];

                if (scope.charges.length > 0) {

                    for (var i in scope.charges) {

                        if (scope.charges[i].chargeTimeType.value == 'Annual Fee') {
                            this.formData1.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                feeOnMonthDay: dateFilter(scope.charges[i].feeOnMonthDay, 'dd MMMM')});
                        } else if (scope.charges[i].chargeTimeType.value == 'Specified due date') {
                            this.formData1.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                dueDate: dateFilter(scope.charges[i].dueDate, scope.df)});
                        } else if (scope.charges[i].chargeTimeType.value == 'Monthly Fee') {
                            this.formData1.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount,
                                feeOnMonthDay: dateFilter(scope.charges[i].feeOnMonthDay, 'dd MMMM'), feeInterval: scope.charges[i].feeInterval});
                        } else if (scope.charges[i].chargeTimeType.value == 'Weekly Fee') {
                            this.formData1.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount, dueDate: dateFilter(scope.charges[i].dueDate, scope.df), feeInterval: scope.charges[i].feeInterval});
                        }
                        else {
                            this.formData1.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount});
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
                                    scope.formData1.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName],
                                        scope.dateFormat);
                                    scope.formData1.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            } else if (scope.columnHeaders[i].columnDisplayType == 'DATETIME') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date) && !_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time)) {
                                    scope.formData1.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date, scope.df)
                                        + " " + dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time, scope.tf);
                                    scope.formData1.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            }
                        });
                    });
                } else {
                    delete scope.formData1.datatables;
                }

                //count the number of selected applications
                var applicationCount=0;
                // count number of application
                for (var i in scope.group.clients) {
                    if (scope.group.clients[i].isSelected) {

                        applicationCount=applicationCount+1;
                    }
                }
                console.log('application count is'+applicationCount);
                scope.formData1.isGSIM=true;
                this.formData.clientArray=[];
                scope.formData1.groupId = scope.groupId; //
                scope.formData1.applicationId=applicationId; //
                var count=0;
                scope.formData1.lastApplication=true;
                var z=0;
                for(var c in scope.group.clients)
                {
                    if(scope.group.clients[c].isSelected)
                    {
                        if(z===0)
                        {
                            scope.formData1.isParentAccount=true;
                        }
                        z++;
                        if(z===applicationCount)
                        {
                            console.log("z is"+z);
                            console.log("val of z"+applicationCount);
                            scope.formData1.lastApplication=true; //
                        }
                        var temp={};
                        temp=JSON.parse(JSON.stringify(scope.formData1));
                        temp.clientId=scope.group.clients[c].id;
                        if(z!=applicationCount)
                        {
                            delete temp.lastApplication;
                        }
                        this.formData.clientArray[count++]=temp;

                        if(z==1)
                        {
                            delete scope.formData1.isParentAccount;
                        }

                    }
                }

                resourceFactory.gsimResource.save(this.formData, function (data) {
                    location.path('/viewgroup/'+ scope.groupId);
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
    mifosX.ng.application.controller('CreateGSIMAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', 'WizardHandler', mifosX.controllers.CreateGSIMAccountController]).run(function ($log) {
        $log.info("CreateGSIMAccountController initialized");
    });
}(mifosX.controllers || {}));

