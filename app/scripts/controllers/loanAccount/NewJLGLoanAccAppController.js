(function (module) {
    mifosX.controllers = _.extend(module, {
        NewJLGLoanAccAppController: function (scope, rootScope, routeParams, resourceFactory, location, dateFilter) {

            scope.response = {success:[],failed:[]};
            scope.group = {};
            scope.group.selectedclients = [];
            scope.group.id = routeParams.groupId;
            scope.staffInSelectedOfficeOnly = true;
            scope.requestIdentifier = "clientId";
            scope.inparams = { resourceType: 'template', templateType: 'jlgbulk', lendingStrategy: 300 };
            scope.selectedProduct = {};
            scope.loanApplicationCommonData = {};  // user set common data for all the loan applications
            scope.loanApplicationCommonData.submittedOnDate = new Date();
            scope.loanApplicationCommonData.expectedDisbursementDate = new Date();
            scope.loanApplicationCommonData.syncDisbursementWithMeeting = true;
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

            if (scope.group.id) {
                scope.inparams.groupId = scope.group.id;
            }

            // Fetch loan products for initital product drop-down
            resourceFactory.loanResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                scope.datatables = data.datatables;
                if (data.group) {
                    scope.group.name = data.group.name;
                }
                scope.handleDatatables(scope.datatables);
            });


            scope.loanProductChange = function (loanProductId) {
                _.isUndefined(scope.datatables) ? scope.tempDataTables = [] : scope.tempDataTables = scope.datatables;
                scope.inparams.productId = loanProductId;
                resourceFactory.loanResource.get(scope.inparams, function (data) {

                    scope.productDetails = data.product;
                    console.log('scope', scope.productDetails);
                    scope.group.clients = data.group.clientMembers.map(function(client) {
                        client.principal = data.product.principal;
                        client.charges = data.product.charges.map(function(charge){
                            charge.isDeleted = false; 
                            return _.clone(charge);});
                        // return was returing the reference, instead the value, so added _.clone
                        return client; 
                    });

                    scope.loanOfficers = data.loanOfficerOptions;
                    scope.funds = data.fundOptions;
                    scope.caledars = data.calendarOptions;
                    scope.loanPurposes = data.loanPurposeOptions;
                    scope.termFrequency = data.termFrequency;
                    scope.termPeriodFrequencyType = data.termPeriodFrequencyType;
                    scope.datatables = data.datatables;
                    scope.handleDatatables(scope.datatables);
                });
            };

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

            scope.toggleCharge = function (clientIndex, chargeIndex) {

                // scope.group.clients[clientIndex].charges.splice(chargeIndex,1);
                if(scope.group.clients[clientIndex].charges[chargeIndex].isDeleted){
                    scope.group.clients[clientIndex].charges[chargeIndex].isDeleted = false;
                }
                else{
                    scope.group.clients[clientIndex].charges[chargeIndex].isDeleted = true;
                }

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

            /* Submit button action */
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
                for (var i in scope.group.clients) {
                    if( scope.group.clients[i].isSelected ){

                        var loanApplication = {};

                        loanApplication.locale = scope.optlang.code;
                        loanApplication.dateFormat =  scope.df;
                        loanApplication.groupId = scope.group.id;
                        loanApplication.clientId = scope.group.clients[i].id;
                        if(scope.caledars){
                            loanApplication.calendarId = scope.caledars[0].id;
                        }
                        loanApplication.loanType = 'jlg';
                        loanApplication.productId = scope.productDetails.id;
                        loanApplication.fundId = scope.loanApplicationCommonData.fundId;
                        loanApplication.numberOfRepayments = scope.productDetails.numberOfRepayments;
                        loanApplication.repaymentEvery = scope.productDetails.repaymentEvery;
                        loanApplication.repaymentFrequencyType = scope.productDetails.repaymentFrequencyType.id;
                        loanApplication.interestRatePerPeriod = scope.productDetails.interestRatePerPeriod;
                        loanApplication.amortizationType = scope.productDetails.amortizationType.id;
                        loanApplication.interestType = scope.productDetails.interestType.id;
                        loanApplication.interestCalculationPeriodType = scope.productDetails.interestCalculationPeriodType.id;
                        loanApplication.inArrearsTolerance = scope.productDetails.inArrearsTolerance;
                        loanApplication.graceOnPrincipalPayment = scope.productDetails.graceOnPrincipalPayment;
                        loanApplication.graceOnInterestPayment = scope.productDetails.graceOnInterestPayment;
                        loanApplication.transactionProcessingStrategyId = scope.productDetails.transactionProcessingStrategyId;
                        loanApplication.loanTermFrequency = scope.termFrequency;
                        loanApplication.loanTermFrequencyType = scope.termPeriodFrequencyType.id;
                        loanApplication.loanPurposeId = scope.group.clients[i].loanPurposeId;

                        loanApplication.loanOfficerId = scope.loanApplicationCommonData.loanOfficerId;
                        loanApplication.principal = scope.group.clients[i].principal;
                        loanApplication.expectedDisbursementDate = dateFilter(scope.loanApplicationCommonData.expectedDisbursementDate, scope.df);
                        loanApplication.submittedOnDate =  dateFilter(scope.loanApplicationCommonData.submittedOnDate, scope.df);
                        loanApplication.syncDisbursementWithMeeting = scope.loanApplicationCommonData.syncDisbursementWithMeeting;


                        loanApplication.charges = [];

                        for (var j in scope.group.clients[i].charges) {

                            if(!scope.group.clients[i].charges[j].isDeleted && scope.group.clients[i].charges[j].chargeTimeType.code !="chargeTimeType.overdueInstallment"){
                                var charge = {};
                                charge.amount = scope.group.clients[i].charges[j].amount;
                                charge.chargeId = scope.group.clients[i].charges[j].id;
                                loanApplication.charges.push(charge);
                            }

                        }
                        if (!_.isUndefined(scope.formData.datatables) && scope.formData.datatables.length > 0) {
                            loanApplication.datatables = scope.formData.datatables;
                        }

                        this.batchRequests.push({requestId: i, relativeUrl: "loans",
                            method: "POST", body: JSON.stringify(loanApplication)});

                    }

                }

                resourceFactory.batchResource.post(this.batchRequests, function (data) {

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
                if (scope.group.id) {
                    location.path('/viewgroup/' + scope.group.id);
                }
            };             


        } // End of NewJLGLoanAccAppController

    });
    mifosX.ng.application.controller('NewJLGLoanAccAppController', ['$scope', '$rootScope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.NewJLGLoanAccAppController]).run(function ($log) {
        $log.info("NewJLGLoanAccAppController initialized");
    });
}(mifosX.controllers || {}));