(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanAccountActionsController: function (scope, rootScope, resourceFactory, location, routeParams, dateFilter) {

            scope.action = routeParams.action || "";
            scope.accountId = routeParams.id;
            scope.formData = {};
            scope.entityformData = {datatables:{}};
            scope.showDateField = true;
            scope.showNoteField = true;
            scope.showAmountField = false;
            scope.restrictDate = new Date();
            // Transaction UI Related
            scope.isTransaction = false;
            scope.showPaymentDetails = false;
            scope.paymentTypes = [];
            scope.form = {};
            scope.form.expectedDisbursementDate = [];
            scope.disbursementDetails = [];
            scope.showTrancheAmountTotal = 0;
            scope.processDate = false;
            scope.submittedDatatables = [];
            var submitStatus = [];

            rootScope.RequestEntities = function(entity,status,productId){
                resourceFactory.entityDatatableChecksResource.getAll({limit:-1},function (response) {
                    scope.entityDatatableChecks = _.filter(response.pageItems , function(datatable){
                        var specificProduct = (datatable.entity == entity && datatable.status.value == status && datatable.productId == productId);
                        var AllProducts = (datatable.entity == entity && datatable.status.value == status);
                        return (datatable.productId?specificProduct:AllProducts);
                    });
                    scope.entityDatatableChecks = _.pluck(scope.entityDatatableChecks,'datatableName');
                    scope.datatables = [];
                    var k=0;
                    _.each(scope.entityDatatableChecks,function(entitytable) {
                        resourceFactory.DataTablesResource.getTableDetails({datatablename:entitytable,entityId: routeParams.id, genericResultSet: 'true'}, function (data) {
                            data.registeredTableName = entitytable;
                            var colName = data.columnHeaders[0].columnName;
                            if (colName == 'id') {
                                data.columnHeaders.splice(0, 1);
                            }

                            colName = data.columnHeaders[0].columnName;
                            if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                                data.columnHeaders.splice(0, 1);
                                scope.isCenter = (colName == 'center_id') ? true : false;
                            }


                            data.noData = (data.data.length == 0);
                            if(data.noData){
                                scope.datatables.push(data);
                                scope.entityformData.datatables[k] = {data:{}};
                                submitStatus[k] = "save";
                                _.each(data.columnHeaders,function(Header){
                                    scope.entityformData.datatables[k].data[Header.columnName] = "";
                                });
                                k++;
                                scope.isEntityDatatables = true;
                            }
                        });


                    });

                });
            };

            scope.fetchEntities = function(entity,status,productId){
                if(!productId){
                    resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id}, function (data) {
                        scope.productId = data.loanProductId;
                        rootScope.RequestEntities(entity,status,scope.productId);
                    });
                }
                else{
                   rootScope.RequestEntities(entity,status,productId);
                }
            };

            //Stack overflow
            function asyncLoop(iterations, func, callback) {
                var index = 0;
                var done = false;
                var loop = {
                    next: function() {
                        if (done) {
                            return;
                        }

                        if (index < iterations) {
                            index++;
                            func(loop);

                        } else {
                            done = true;
                            callback();
                        }
                    },

                    iteration: function() {
                        return index - 1;
                    },

                    break: function() {
                        done = true;
                    }
                };
                loop.next();
                return loop;
            }

            switch (scope.action) {
                case "approve":
                    scope.taskPermissionName = 'APPROVE_LOAN';
                    resourceFactory.loanTemplateResource.get({loanId: scope.accountId, templateType: 'approval'}, function (data) {

                        scope.title = 'label.heading.approveloanaccount';
                        scope.labelName = 'label.input.approvedondate';
                        scope.modelName = 'approvedOnDate';
                        scope.formData[scope.modelName] =  new Date();
                        scope.showApprovalAmount = true;
                        scope.formData.approvedLoanAmount =  data.approvalAmount;
                    });
                    resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'multiDisburseDetails'}, function (data) {
                        scope.form.expectedDisbursementDate = new Date(data.timeline.expectedDisbursementDate);
                        scope.productId = data.loanProductId;
                        if(data.disbursementDetails != ""){
                            scope.disbursementDetails = data.disbursementDetails;
                            scope.approveTranches = true;
                        }
                        for(var i in data.disbursementDetails){
                            scope.disbursementDetails[i].expectedDisbursementDate = new Date(data.disbursementDetails[i].expectedDisbursementDate);
                            scope.disbursementDetails[i].principal = data.disbursementDetails[i].principal;
                            scope.showTrancheAmountTotal += Number(data.disbursementDetails[i].principal) ;
                        }
                        scope.fetchEntities('m_loan','APPROVE',scope.productId);
                    });
                    break;
                case "reject":
                    scope.title = 'label.heading.rejectloanaccount';
                    scope.labelName = 'label.input.rejectedondate';
                    scope.modelName = 'rejectedOnDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.taskPermissionName = 'REJECT_LOAN';
                    scope.fetchEntities('m_loan','REJECTED');
                    break;
                case "withdrawnByApplicant":
                    scope.title = 'label.heading.withdrawloanaccount';
                    scope.labelName = 'label.input.withdrawnondate';
                    scope.modelName = 'withdrawnOnDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.taskPermissionName = 'WITHDRAW_LOAN';
                    scope.fetchEntities('m_loan','WITHDRAWN');
                    break;
                case "undoapproval":
                    scope.title = 'label.heading.undoapproveloanaccount';
                    scope.showDateField = false;
                    scope.taskPermissionName = 'APPROVALUNDO_LOAN';
                    break;
                case "undodisbursal":
                    scope.title = 'label.heading.undodisburseloanaccount';
                    scope.showDateField = false;
                    scope.taskPermissionName = 'DISBURSALUNDO_LOAN';
                    break;
                case "disburse":
                    scope.modelName = 'actualDisbursementDate';
                    resourceFactory.loanTrxnsTemplateResource.get({loanId: scope.accountId, command: 'disburse'}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                        if (data.paymentTypeOptions.length > 0) {
                            scope.formData.paymentTypeId = data.paymentTypeOptions[0].id;
                        }
                        scope.formData.transactionAmount = data.amount;
                        scope.formData[scope.modelName] = new Date();
                        if (data.fixedEmiAmount) {
                            scope.formData.fixedEmiAmount = data.fixedEmiAmount;
                            scope.showEMIAmountField = true;
                        }
                    });
                    scope.title = 'label.heading.disburseloanaccount';
                    scope.labelName = 'label.input.disbursedondate';
                    scope.isTransaction = true;
                    scope.showAmountField = true;
                    scope.taskPermissionName = 'DISBURSE_LOAN';
                    scope.fetchEntities('m_loan','DISBURSE');
                    break;
                case "disbursetosavings":
                    scope.modelName = 'actualDisbursementDate';
                    resourceFactory.loanTrxnsTemplateResource.get({loanId: scope.accountId, command: 'disburseToSavings'}, function (data) {
                       scope.formData.transactionAmount = data.amount;
                        scope.formData[scope.modelName] = new Date();
                        if (data.fixedEmiAmount) {
                            scope.formData.fixedEmiAmount = data.fixedEmiAmount;
                            scope.showEMIAmountField = true;
                        }
                    });
                    scope.title = 'label.heading.disburseloanaccount';
                    scope.labelName = 'label.input.disbursedondate';
                    scope.isTransaction = false;
                    scope.showAmountField = true;
                    scope.taskPermissionName = 'DISBURSETOSAVINGS_LOAN';
                    break;
                case "repayment":
                    scope.modelName = 'transactionDate';
                    resourceFactory.loanTrxnsTemplateResource.get({loanId: scope.accountId, command: 'repayment'}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                        if (data.paymentTypeOptions.length > 0) {
                            scope.formData.paymentTypeId = data.paymentTypeOptions[0].id;
                        }
                        scope.formData.transactionAmount = data.amount;
                        scope.formData[scope.modelName] = new Date(data.date) || new Date();
                        if(data.penaltyChargesPortion>0){
                            scope.showPenaltyPortionDisplay = true;
                        }
                    });
                    scope.title = 'label.heading.loanrepayments';
                    scope.labelName = 'label.input.transactiondate';
                    scope.isTransaction = true;
                    scope.showAmountField = true;
                    scope.taskPermissionName = 'REPAYMENT_LOAN';
                    break;
                case "prepayloan":
                    scope.modelName = 'transactionDate';
                    scope.formData.transactionDate =  new Date();
                    resourceFactory.loanTrxnsTemplateResource.get({loanId: scope.accountId, command: 'prepayLoan'}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                        if (data.paymentTypeOptions.length > 0) {
                            scope.formData.paymentTypeId = data.paymentTypeOptions[0].id;
                        }
                        scope.formData.transactionAmount = data.amount;
                        if(data.penaltyChargesPortion>0){
                            scope.showPenaltyPortionDisplay = true;
                        }
                        scope.principalPortion = data.principalPortion;
                        scope.interestPortion = data.interestPortion;
                        scope.feeChargesPortion = data.feeChargesPortion;
                        scope.processDate = true;
                    });
                    scope.title = 'label.heading.prepayloan';
                    scope.labelName = 'label.input.transactiondate';
                    scope.isTransaction = true;
                    scope.showAmountField = true;
                    scope.taskPermissionName = 'REPAYMENT_LOAN';
                    scope.action = 'repayment';
                    break;
                case "waiveinterest":
                    scope.modelName = 'transactionDate';
                    resourceFactory.loanTrxnsTemplateResource.get({loanId: scope.accountId, command: 'waiveinterest'}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                        scope.formData.transactionAmount = data.amount;
                        scope.formData[scope.modelName] = new Date(data.date) || new Date();
                    });
                    scope.title = 'label.heading.loanwaiveinterest';
                    scope.labelName = 'label.input.interestwaivedon';
                    scope.showAmountField = true;
                    scope.taskPermissionName = 'WAIVEINTERESTPORTION_LOAN';
                    break;
                case "writeoff":
                    scope.modelName = 'transactionDate';
                    resourceFactory.loanTrxnsTemplateResource.get({loanId: scope.accountId, command: 'writeoff'}, function (data) {
                        scope.formData[scope.modelName] = new Date(data.date) || new Date();
                        scope.writeOffAmount = data.amount;
                        scope.isLoanWriteOff = true;
                    });
                    scope.title = 'label.heading.writeoffloanaccount';
                    scope.labelName = 'label.input.writeoffondate';
                    scope.taskPermissionName = 'WRITEOFF_LOAN';
                    scope.fetchEntities('m_loan','WRITE_OFF');
                    break;
                case "close-rescheduled":
                    scope.modelName = 'transactionDate';
                    resourceFactory.loanTrxnsTemplateResource.get({loanId: scope.accountId, command: 'close-rescheduled'}, function (data) {
                        scope.formData[scope.modelName] = new Date(data.date) || new Date();
                    });
                    scope.title = 'label.heading.closeloanaccountasrescheduled';
                    scope.labelName = 'label.input.closedondate';
                    scope.taskPermissionName = 'CLOSEASRESCHEDULED_LOAN';
                    break;
                case "close":
                    scope.modelName = 'transactionDate';
                    resourceFactory.loanTrxnsTemplateResource.get({loanId: scope.accountId, command: 'close'}, function (data) {
                        scope.formData[scope.modelName] = new Date(data.date) || new Date();
                    });
                    scope.title = 'label.heading.closeloanaccount';
                    scope.labelName = 'label.input.closedondate';
                    scope.taskPermissionName = 'CLOSE_LOAN';
                    break;
                case "unassignloanofficer":
                    scope.title = 'label.heading.unassignloanofficer';
                    scope.labelName = 'label.input.loanofficerunassigneddate';
                    scope.modelName = 'unassignedDate';
                    scope.showNoteField = false;
                    scope.formData[scope.modelName] = new Date();
                    scope.taskPermissionName = 'REMOVELOANOFFICER_LOAN';
                    break;
                case "modifytransaction":
                    resourceFactory.loanTrxnsResource.get({loanId: scope.accountId, transactionId: routeParams.transactionId, template: 'true'},
                        function (data) {
                            scope.title = 'label.heading.editloanaccounttransaction';
                            scope.labelName = 'label.input.transactiondate';
                            scope.modelName = 'transactionDate';
                            scope.paymentTypes = data.paymentTypeOptions || [];
                            scope.formData.transactionAmount = data.amount;
                            scope.formData[scope.modelName] = new Date(data.date) || new Date();
                            if (data.paymentDetailData) {
                                if (data.paymentDetailData.paymentType) {
                                    scope.formData.paymentTypeId = data.paymentDetailData.paymentType.id;
                                }
                                scope.formData.accountNumber = data.paymentDetailData.accountNumber;
                                scope.formData.checkNumber = data.paymentDetailData.checkNumber;
                                scope.formData.routingCode = data.paymentDetailData.routingCode;
                                scope.formData.receiptNumber = data.paymentDetailData.receiptNumber;
                                scope.formData.bankNumber = data.paymentDetailData.bankNumber;
                            }
                        });
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.showAmountField = true;
                    scope.isTransaction = true;
                    scope.showPaymentDetails = false;
                    scope.taskPermissionName = 'ADJUST_LOAN';
                    break;
                case "deleteloancharge":
                    scope.showDelete = true;
                    scope.showNoteField = false;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'DELETE_LOANCHARGE';
                    break;
                case "recoverguarantee":
                    scope.showDelete = true;
                    scope.showNoteField = false;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'RECOVERGUARANTEES_LOAN';
                    break;
                case "waivecharge":
                    resourceFactory.LoanAccountResource.get({loanId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId}, function (data) {
                        if (data.chargeTimeType.value !== "Specified due date" && data.installmentChargeData) {
                            scope.installmentCharges = data.installmentChargeData;
                            scope.formData.installmentNumber = data.installmentChargeData[0].installmentNumber;
                            scope.installmentchargeField = true;
                        } else {
                            scope.installmentchargeField = false;
                            scope.showwaiveforspecicficduedate = true;
                        }
                    });

                    scope.title = 'label.heading.waiveloancharge';
                    scope.labelName = 'label.input.installment';
                    scope.showNoteField = false;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'WAIVE_LOANCHARGE';
                    break;
                case "paycharge":
                    resourceFactory.LoanAccountResource.get({loanId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId, command: 'pay'}, function (data) {
                        if (data.dueDate) {
                            scope.formData.transactionDate = new Date(data.dueDate);
                        }
                        if (data.chargeTimeType.value === "Instalment Fee" && data.installmentChargeData) {
                            scope.installmentCharges = data.installmentChargeData;
                            scope.formData.installmentNumber = data.installmentChargeData[0].installmentNumber;
                            scope.installmentchargeField = true;
                        }
                    });
                    scope.title = 'label.heading.payloancharge';
                    scope.showNoteField = false;
                    scope.showDateField = false;
                    scope.paymentDatefield = true;
                    scope.taskPermissionName = 'PAY_LOANCHARGE';
                    break;
                case "editcharge":
                    resourceFactory.LoanAccountResource.get({loanId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId}, function (data) {
                        if (data.amountOrPercentage) {
                            scope.showEditChargeAmount = true;
                            scope.formData.amount = data.amountOrPercentage;
                            if (data.dueDate) {
                                scope.formData.dueDate = new Date(data.dueDate);
                                scope.showEditChargeDueDate = true;
                            }
                        }

                    });
                    scope.title = 'label.heading.editcharge';
                    scope.showNoteField = false;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'UPDATE_LOANCHARGE';
                    break;
                case "editdisbursedate":
                    resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'multiDisburseDetails'}, function (data) {
                        scope.showEditDisburseDate = true;
                        scope.formData.approvedLoanAmount = data.approvedPrincipal;
                        scope.form.expectedDisbursementDate = new Date(data.timeline.expectedDisbursementDate);
                        for(var i in data.disbursementDetails){
                            if(routeParams.disbursementId == data.disbursementDetails[i].id){
                                scope.formData.updatedExpectedDisbursementDate = new Date(data.disbursementDetails[i].expectedDisbursementDate);
                                scope.formData.updatedPrincipal = data.disbursementDetails[i].principal;
                                scope.id = data.disbursementDetails[i].id;
                            }
                        }
                    });

                    scope.title = 'label.heading.editdisbursedate';
                    scope.showNoteField = false;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'UPDATE_DISBURSEMENTDETAIL';
                    break;
                case "recoverypayment":
                    scope.modelName = 'transactionDate';
                    resourceFactory.loanTrxnsTemplateResource.get({loanId: scope.accountId, command: 'recoverypayment'}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                        if (data.paymentTypeOptions.length > 0) {
                            scope.formData.paymentTypeId = data.paymentTypeOptions[0].id;
                        }
                        scope.formData.transactionAmount = data.amount;
                        scope.formData[scope.modelName] = new Date();
                    });
                    scope.title = 'label.heading.recoverypayment';
                    scope.labelName = 'label.input.transactiondate';
                    scope.isTransaction = true;
                    scope.showAmountField = true;
                    scope.taskPermissionName = 'RECOVERYPAYMENT_LOAN';
                    break;
                case "adddisbursedetails":
                    resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'multiDisburseDetails'}, function (data) {
                        scope.addDisburseDetails = true;
                        scope.formData.approvedLoanAmount = data.approvedPrincipal;
                        scope.form.expectedDisbursementDate = new Date(data.timeline.expectedDisbursementDate);

                        if(data.disbursementDetails != ""){
                            scope.disbursementDetails = data.disbursementDetails;
                        }
                        if (scope.disbursementDetails.length > 0) {
                            for (var i in scope.disbursementDetails) {
                                scope.disbursementDetails[i].expectedDisbursementDate = new Date(scope.disbursementDetails[i].expectedDisbursementDate);
                            }
                        }
                        scope.disbursementDetails.push({
                        });
                    });

                    scope.title = 'label.heading.adddisbursedetails';
                    scope.showNoteField = false;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'UPDATE_DISBURSEMENTDETAIL';
                    break;
                case "deletedisbursedetails":
                    resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'multiDisburseDetails'}, function (data) {
                        scope.deleteDisburseDetails = true;
                        scope.formData.approvedLoanAmount = data.approvedPrincipal;
                        scope.form.expectedDisbursementDate = new Date(data.timeline.expectedDisbursementDate);
                        if(data.disbursementDetails != ""){
                            scope.disbursementDetails = data.disbursementDetails;
                        }
                        if (scope.disbursementDetails.length > 0) {
                            for (var i in scope.disbursementDetails) {
                                scope.disbursementDetails[i].expectedDisbursementDate = new Date(scope.disbursementDetails[i].expectedDisbursementDate);
                            }
                        }
                    });

                    scope.title = 'label.heading.deletedisbursedetails';
                    scope.showNoteField = false;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'UPDATE_DISBURSEMENTDETAIL';
                    break;
            }

            scope.cancel = function () {
                location.path('/viewloanaccount/' + routeParams.id);
            };

            scope.addTrancheAmounts = function(){
                scope.showTrancheAmountTotal = 0;
                for(var i in scope.disbursementDetails ){
                    scope.showTrancheAmountTotal += Number(scope.disbursementDetails[i].principal);
                }
            };

            scope.deleteTranches = function (index) {
                scope.disbursementDetails.splice(index, 1);
            };

            scope.addTranches = function () {
                scope.disbursementDetails.push({
                });
            };

            scope.submit = function () {
                scope.processDate = false;
                var params = {command: scope.action};
                if(scope.action == "recoverguarantee"){
                    params.command = "recoverGuarantees";
                }
                if(scope.action == "approve"){
                    this.formData.expectedDisbursementDate = dateFilter(scope.form.expectedDisbursementDate, scope.df);
                    if(scope.disbursementDetails != null) {
                        this.formData.disbursementData = [];
                        for (var i in  scope.disbursementDetails) {
                            this.formData.disbursementData.push({
                                id: scope.disbursementDetails[i].id,
                                principal: scope.disbursementDetails[i].principal,
                                expectedDisbursementDate: dateFilter(scope.disbursementDetails[i].expectedDisbursementDate, scope.df),
                                loanChargeId : scope.disbursementDetails[i].loanChargeId
                            });
                        }
                        console.log("DISBURSEMENT DATA", this.formData.expectedDisbursementDate);
                    }
                    if(scope.formData.approvedLoanAmount == null){
                        scope.formData.approvedLoanAmount = scope.showTrancheAmountTotal;
                    }
                }

                if (this.formData[scope.modelName]) {
                    this.formData[scope.modelName] = dateFilter(this.formData[scope.modelName], scope.df);
                }
                if (scope.action != "undoapproval" && scope.action != "undodisbursal" || scope.action === "paycharge") {
                    this.formData.locale = scope.optlang.code;
                    this.formData.dateFormat = scope.df;
                }
                if (scope.action == "repayment" || scope.action == "waiveinterest" || scope.action == "writeoff" || scope.action == "close-rescheduled"
                    || scope.action == "close" || scope.action == "modifytransaction" || scope.action == "recoverypayment" || scope.action == "prepayloan") {
                    if (scope.action == "modifytransaction") {
                        params.command = 'modify';
                        params.transactionId = routeParams.transactionId;
                    }
                    params.loanId = scope.accountId;
                    resourceFactory.loanTrxnsResource.save(params, this.formData, function (data) {
                        location.path('/viewloanaccount/' + data.loanId);
                    });
                } else if (scope.action == "deleteloancharge") {
                    resourceFactory.LoanAccountResource.delete({loanId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId}, this.formData, function (data) {
                        location.path('/viewloanaccount/' + data.loanId);
                    });
                } else if (scope.action === "waivecharge") {
                    resourceFactory.LoanAccountResource.save({loanId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId, 'command': 'waive'}, this.formData, function (data) {
                        location.path('/viewloanaccount/' + data.loanId);
                    });
                } else if (scope.action === "paycharge") {
                    this.formData.transactionDate = dateFilter(this.formData.transactionDate, scope.df);
                    resourceFactory.LoanAccountResource.save({loanId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId, 'command': 'pay'}, this.formData, function (data) {
                        location.path('/viewloanaccount/' + data.loanId);
                    });
                } else if (scope.action === "editcharge") {
                    this.formData.dueDate = dateFilter(this.formData.dueDate, scope.df);
                    resourceFactory.LoanAccountResource.update({loanId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId}, this.formData, function (data) {
                        location.path('/viewloanaccount/' + data.loanId);
                    });
                } else if (scope.action === "editdisbursedate") {
                    this.formData.expectedDisbursementDate = dateFilter(this.formData.expectedDisbursementDate, scope.df);
                    for(var i in scope.disbursementDetails){
                        if(scope.disbursementDetails[i].id == scope.id){
                            scope.disbursementDetails[i].principal = scope.formData.updatedPrincipal;
                            scope.disbursementDetails[i].expectedDisbursementDate = dateFilter(scope.formData.updatedExpectedDisbursementDate, scope.df);
                        }
                    }
                    this.formData.disbursementData = [];
                    this.formData.updatedExpectedDisbursementDate = dateFilter(scope.formData.updatedExpectedDisbursementDate, scope.df);
                    this.formData.expectedDisbursementDate = dateFilter(scope.form.expectedDisbursementDate, scope.df);

                    for (var i in  scope.disbursementDetails) {
                        this.formData.disbursementData.push({
                            id: scope.disbursementDetails[i].id,
                            principal: scope.disbursementDetails[i].principal,
                            expectedDisbursementDate: dateFilter(scope.disbursementDetails[i].expectedDisbursementDate, scope.df),
                            loanChargeId : scope.disbursementDetails[i].loanChargeId
                        });
                    }
                    resourceFactory.LoanEditDisburseResource.update({loanId: routeParams.id, disbursementId: routeParams.disbursementId}, this.formData, function (data) {
                        location.path('/viewloanaccount/' + data.loanId);
                    });
                }else if(scope.action === "adddisbursedetails" || scope.action === "deletedisbursedetails") {
                    this.formData.disbursementData = [];
                    for (var i in  scope.disbursementDetails) {
                            this.formData.disbursementData.push({
                                id:scope.disbursementDetails[i].id,
                                principal: scope.disbursementDetails[i].principal,
                                expectedDisbursementDate: dateFilter(scope.disbursementDetails[i].expectedDisbursementDate, scope.df),
                                loanChargeId : scope.disbursementDetails[i].loanChargeId
                            });
                    }

                    this.formData.expectedDisbursementDate = dateFilter(scope.form.expectedDisbursementDate, scope.df);
                    resourceFactory.LoanAddTranchesResource.update({loanId: routeParams.id}, this.formData, function (data) {
                        location.path('/viewloanaccount/' + data.loanId);
                    });
                }
                else if (scope.action == "deleteloancharge") {
                    resourceFactory.LoanAccountResource.delete({loanId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId}, this.formData, function (data) {
                        location.path('/viewloanaccount/' + data.loanId);
                    });
                } else {
                    params.loanId = scope.accountId;
                    resourceFactory.LoanAccountResource.save(params, this.formData, function (data) {

                        location.path('/viewloanaccount/' + data.loanId);
                    });
                }
            };

             scope.submitDatatable = function(){
                if(scope.datatables) {
                    asyncLoop(Object.keys(scope.entityformData.datatables).length,function(loop){
                            var cnt = loop.iteration();
                            var formData = scope.entityformData.datatables[cnt];
                            formData.registeredTableName = scope.datatables[cnt].registeredTableName;

                            var params = {
                                datatablename: formData.registeredTableName,
                                entityId: routeParams.id,
                                genericResultSet: 'true'
                            };

                            angular.extend(formData.data,{dateFormat: scope.df, locale: scope.optlang.code});

                            _.each(formData.data, function (columnHeader) {
                                if (columnHeader.dateType) {
                                    columnHeader = dateFilter(columnHeader.dateType.date, params.dateFormat);
                                }
                                else if (columnHeader.dateTimeType) {
                                    columnHeader = dateFilter(columnHeader.columnName.date, scope.df) + " " + dateFilter(columnHeader.columnName.time, scope.tf);
                                }
                            });

                            var action = submitStatus[cnt];
                            resourceFactory.DataTablesResource[action](params, formData.data, function (data) {

                                submitStatus[cnt] = "update";
                                scope.submittedDatatables.push(scope.datatables[cnt].registeredTableName);
                                loop.next();

                            },function(){
                                rootScope.errorDetails[0].push({datatable:scope.datatables[cnt].registeredTableName});
                                loop.break();
                            });

                    },function(){
                            scope.submit();
                    });
                }
                else{
                    scope.submit();
                }
            };

            scope.$watch('formData.transactionDate',function(){
                scope.onDateChange();
             });



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



            scope.onDateChange = function(){
                if(scope.processDate) {
                    var params = {};
                    params.locale = scope.optlang.code;
                    params.dateFormat = scope.df;
                    params.transactionDate = dateFilter(this.formData.transactionDate, scope.df);
                    params.loanId = scope.accountId;
                    params.command = 'prepayLoan';
                    resourceFactory.loanTrxnsTemplateResource.get(params, function (data) {
                        scope.formData.transactionAmount = data.amount;
                        if (data.penaltyChargesPortion > 0) {
                            scope.showPenaltyPortionDisplay = true;
                        }
                        scope.principalPortion = data.principalPortion;
                        scope.interestPortion = data.interestPortion;
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('LoanAccountActionsController', ['$scope','$rootScope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.LoanAccountActionsController]).run(function ($log) {
        $log.info("LoanAccountActionsController initialized");
    });
}(mifosX.controllers || {}));
