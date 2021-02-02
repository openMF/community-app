(function (module) {
    mifosX.controllers = _.extend(module, {
        NewGLIMAccountController: function (scope, rootScope, routeParams, resourceFactory, location, dateFilter, WizardHandler) {

            scope.response = {success:[],failed:[]};
            scope.group = {};
            scope.clientId = routeParams.clientId;
            scope.groupId = routeParams.groupId;
            scope.group.selectedclients = [];
            scope.group.id = routeParams.groupId;
            scope.staffInSelectedOfficeOnly = true;
            scope.requestIdentifier = "clientId";
            scope.inparams = { resourceType: 'template', templateType: 'jlgbulk', lendingStrategy: 300 };
            scope.selectedProduct = {};
            scope.loanApplicationCommonData = {};  // user set common data for all the loan applications
            scope.loanApplicationCommonData.submittedOnDate = new Date();
            scope.loanApplicationCommonData.expectedDisbursementDate = new Date();
            scope.loanApplicationCommonData.syncDisbursementWithMeeting = false;
            scope.datatables = [];
            scope.noOfTabs = 1;
            scope.step = '-';
            scope.formData = {};
            scope.formDat = {};
            scope.formData.datatables = [];
            scope.formDat.datatables = [];
            scope.tf = "HH:mm";
            scope.tempDataTables = [];
            scope.isAllClientSelected = false;
            scope.gsimAccounts=[];
            scope.gsimAccountId=0;
            scope.date = {};
            scope.chargeFormData = {}; //For charges

            if (scope.group.id) {
                scope.inparams.groupId = scope.group.id;
            }

            // Fetch loan products for initital product drop-down
            resourceFactory.loanResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                scope.datatables = data.datatables;

                if (data.clientName) {
                    scope.clientName = data.clientName;
                }
                if (data.group) {
                    scope.groupName = data.group.name;
                }
                scope.handleDatatables(scope.datatables);
            });

            scope.loanProductChange = function (loanProductId) {
                _.isUndefined(scope.datatables) ? scope.tempDataTables = [] : scope.tempDataTables = scope.datatables;
                WizardHandler.wizard().removeSteps(1, scope.tempDataTables.length);
                scope.inparams.productId = loanProductId;
                resourceFactory.loanResource.get(scope.inparams, function (data) {
                    scope.productDetails = data.product;
                    scope.loanaccountinfo = data;
                    scope.previewClientLoanAccInfo();
                    scope.datatables = data.datatables;
                    scope.handleDatatables(scope.datatables);
                    scope.loanOfficers = data.loanOfficerOptions;
                    scope.funds = data.fundOptions;
                    scope.loanPurposes = data.loanPurposeOptions;
                    scope.group.clients = data.group.clientMembers.map(function(client) {
                        client.principal = data.product.principal;
                        client.charges = data.product.charges.map(function(charge){
                            charge.isDeleted = false;
                            return _.clone(charge);});
                        return client;
                    });
                });

                resourceFactory.loanResource.get({resourceType: 'template', templateType: 'collateral', productId: loanProductId, fields: 'id,loanCollateralOptions'}, function (data) {
                    scope.collateralOptions = data.loanCollateralOptions || [];
                });
            }

            scope.previewClientLoanAccInfo = function () {
                scope.previewRepayment = false;
                scope.charges = scope.loanaccountinfo.charges || [];
                scope.formData.disbursementData = scope.loanaccountinfo.disbursementDetails || [];
                scope.collaterals = [];

                if (scope.loanaccountinfo.calendarOptions) {
                    scope.formData.syncRepaymentsWithMeeting = true;
                    scope.formData.syncDisbursementWithMeeting = true;
                }
                scope.multiDisburseLoan = scope.loanaccountinfo.multiDisburseLoan;
                scope.formData.productId = scope.loanaccountinfo.loanProductId;
                scope.formData.fundId = scope.loanaccountinfo.fundId;
                scope.formData.principal = scope.loanaccountinfo.principal;
                scope.formData.loanTermFrequency = scope.loanaccountinfo.termFrequency;
                scope.formData.loanTermFrequencyType = scope.loanaccountinfo.termPeriodFrequencyType.id;
                scope.formData.numberOfRepayments = scope.loanaccountinfo.numberOfRepayments;
                scope.formData.repaymentEvery = scope.loanaccountinfo.repaymentEvery;
                scope.formData.repaymentFrequencyType = scope.loanaccountinfo.repaymentFrequencyType.id;
                scope.formData.interestRatePerPeriod = scope.loanaccountinfo.interestRatePerPeriod;
                scope.formData.amortizationType = scope.loanaccountinfo.amortizationType.id;
                scope.formData.interestType = scope.loanaccountinfo.interestType.id;
                scope.formData.interestCalculationPeriodType = scope.loanaccountinfo.interestCalculationPeriodType.id;
                scope.formData.allowPartialPeriodInterestCalcualtion = scope.loanaccountinfo.allowPartialPeriodInterestCalcualtion;
                scope.formData.inArrearsTolerance = scope.loanaccountinfo.inArrearsTolerance;
                scope.formData.graceOnPrincipalPayment = scope.loanaccountinfo.graceOnPrincipalPayment;
                scope.formData.graceOnInterestPayment = scope.loanaccountinfo.graceOnInterestPayment;
                scope.formData.graceOnArrearsAgeing = scope.loanaccountinfo.graceOnArrearsAgeing;
                scope.formData.transactionProcessingStrategyId = scope.loanaccountinfo.transactionProcessingStrategyId;
                scope.formData.graceOnInterestCharged = scope.loanaccountinfo.graceOnInterestCharged;
                scope.formData.fixedEmiAmount = scope.loanaccountinfo.fixedEmiAmount;
                scope.formData.maxOutstandingLoanBalance = scope.loanaccountinfo.maxOutstandingLoanBalance;

                if (scope.loanaccountinfo.isInterestRecalculationEnabled && scope.loanaccountinfo.interestRecalculationData.recalculationRestFrequencyDate) {
                    scope.date.recalculationRestFrequencyDate = new Date(scope.loanaccountinfo.interestRecalculationData.recalculationRestFrequencyDate);
                }
                if (scope.loanaccountinfo.isInterestRecalculationEnabled && scope.loanaccountinfo.interestRecalculationData.recalculationCompoundingFrequencyDate) {
                    scope.date.recalculationCompoundingFrequencyDate = new Date(scope.loanaccountinfo.interestRecalculationData.recalculationCompoundingFrequencyDate);
                }

                if(scope.loanaccountinfo.isLoanProductLinkedToFloatingRate) {
                    scope.formData.isFloatingInterestRate = false ;
                }
            }

            scope.addCharge = function () {
                if (scope.chargeFormData.chargeId) {
                    resourceFactory.chargeResource.get({chargeId: this.chargeFormData.chargeId, template: 'true'}, function (data) {
                        data.chargeId = data.id;
                        scope.charges.push(data);
                        scope.chargeFormData.chargeId = undefined;
                    });
                }
            }

            scope.deleteCharge = function (index) {
                scope.charges.splice(index, 1);
            }

            resourceFactory.groupGSIMAccountResource.get({groupId:routeParams.groupId},function(data)
            {
                scope.gsimAccounts=data;

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

            scope.checkerInboxAllCheckBoxesClicked = function() {
                scope.isAllClientSelected = !scope.isAllClientSelected;
                if(!angular.isUndefined(scope.group.clients)) {
                    for (var i in scope.group.clients) {
                        scope.group.clients[i].isSelected = scope.isAllClientSelected;
                    }
                }
            }

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

            scope.submit = function () {

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

                this.batchRequests = [];
                var totalLoan=0;
                for (var i in scope.group.clients) {

                    if( scope.group.clients[i].isSelected ){
                        totalLoan+=parseFloat(scope.group.clients[i].principal);
                    }
                }

                var loanApp={};
                loanApp.charges=[];
                if (scope.charges.length > 0) {

                    for (var i in scope.charges) {
                        loanApp.charges.push({ chargeId: scope.charges[i].chargeId, amount: scope.charges[i].amount, dueDate: dateFilter(scope.charges[i].dueDate, scope.df) });
                    }
                }

                console.log("gsim id"+scope.formData.gsimAccountId);

                var child=0;
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
                var reqThirdDate = dateFilter(scope.date.third, scope.df);
                var reqFourthDate = dateFilter(scope.date.fourth, scope.df);
                var reqFifthDate = dateFilter(scope.date.fifth, scope.df);

                var applicationCount=0;
                // count number of application
                for (var i in scope.group.clients) {
                    if (scope.group.clients[i].isSelected) {

                        applicationCount=applicationCount+1;
                    }
                }

                var applicationId= Math.floor((Math.random() * 9999999999) + 1);

                for (var i in scope.group.clients) {

                    if( scope.group.clients[i].isSelected ){

                        var loanApplication = {};
                        loanApplication.charges=loanApp.charges;
                        loanApplication.locale = scope.optlang.code;
                        loanApplication.dateFormat =  scope.df;
                        loanApplication.groupId = scope.group.id;
                        loanApplication.clientId = scope.group.clients[i].id;
                        if(scope.caledars){
                            loanApplication.calendarId = scope.caledars[0].id;
                        }
                        loanApplication.loanType = 'glim';
                        loanApplication.productId = scope.productDetails.id;
                        loanApplication.fundId = scope.loanApplicationCommonData.fundId;
                        loanApplication.numberOfRepayments = scope.formData.numberOfRepayments;
                        loanApplication.repaymentEvery = scope.formData.repaymentEvery;
                        loanApplication.repaymentFrequencyType = scope.formData.repaymentFrequencyType;
                        loanApplication.repaymentsStartingFromDate = reqFourthDate;
                        loanApplication.interestChargedFromDate = reqThirdDate;
                        loanApplication.interestRatePerPeriod = scope.formData.interestRatePerPeriod;
                        loanApplication.amortizationType = scope.productDetails.amortizationType.id;
                        loanApplication.interestType = scope.formData.interestType;
                        loanApplication.interestCalculationPeriodType = scope.productDetails.interestCalculationPeriodType.id;
                        loanApplication.inArrearsTolerance = scope.productDetails.inArrearsTolerance;
                        loanApplication.graceOnPrincipalPayment = scope.productDetails.graceOnPrincipalPayment;
                        loanApplication.graceOnInterestPayment = scope.productDetails.graceOnInterestPayment;
                        loanApplication.transactionProcessingStrategyId = scope.productDetails.transactionProcessingStrategyId;
                        loanApplication.loanTermFrequency = scope.formData.loanTermFrequency;
                        loanApplication.loanTermFrequencyType = scope.formData.loanTermFrequencyType;
                        loanApplication.loanPurposeId = scope.group.clients[i].loanPurposeId;
                        loanApplication.loanOfficerId = scope.loanApplicationCommonData.loanOfficerId;
                        loanApplication.principal = scope.group.clients[i].principal;

                        if(child==0)
                        {
                            loanApplication.totalLoan=totalLoan;
                            loanApplication.isParentAccount=true;

                        }

                        loanApplication.expectedDisbursementDate = dateFilter(scope.loanApplicationCommonData.expectedDisbursementDate, scope.df);
                        loanApplication.submittedOnDate =  dateFilter(scope.loanApplicationCommonData.submittedOnDate, scope.df);
                        loanApplication.syncDisbursementWithMeeting = scope.loanApplicationCommonData.syncDisbursementWithMeeting;
                        loanApplication.lastApplication=false;
                        loanApplication.applicationId=applicationId;

                        loanApplication.linkAccountId=scope.formData.gsimAccountId;
                        console.log('formData.gsimAccountId : '+scope.formData.gsimAccountId);

                        if (!_.isUndefined(scope.formData.datatables) && scope.formData.datatables.length > 0) {
                            loanApplication.datatables = scope.formData.datatables;
                        }

                        child=child+1;

                        if(child==applicationCount)
                        {
                            loanApplication.lastApplication=true;
                        }

                        this.batchRequests.push({requestId: i, relativeUrl: "loans",
                            method: "POST", body: JSON.stringify(loanApplication)});
                    }
                }

                resourceFactory.batchResource.post({
                    enclosingTransaction:true},this.batchRequests,  function (data) {

                    for (var i = 0; i < data.length; i++) {
                        if(data[i].statusCode == 200 )
                            scope.response.success.push(data[i]);
                        else
                            scope.response.failed.push(data[i]);
                    }

                    if(scope.response.failed.length === 0 ){
                        location.path('/viewgroup/' + scope.group.id);
                    }
                });
            };

            /* Cancel button action */
            scope.cancel = function () {
                if (scope.clientId) {
                    location.path('/viewclient/' + scope.clientId);
                } else if (scope.centerEntity) {
                    location.path('/viewcenter/' + scope.groupId);
                }
                if (scope.group.id) {
                    location.path('/viewgroup/' + scope.group.id);
                }
            };
        } // End of GLIMAccountController

    });
    mifosX.ng.application.controller('NewGLIMAccountController', ['$scope', '$rootScope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', 'WizardHandler', mifosX.controllers.NewGLIMAccountController]).run(function ($log) {
        $log.info("NewGLIMAccountController initialized");
    });
}(mifosX.controllers || {}));