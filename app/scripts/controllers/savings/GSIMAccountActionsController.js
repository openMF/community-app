(function (module) {
    mifosX.controllers = _.extend(module, {
        GSIMAccountActionsController: function (scope, resourceFactory, location, routeParams, dateFilter) {

            scope.groupId=routeParams.groupId;
            scope.gsimAccountNumber=routeParams.gsimAccountNumber;
            scope.action = routeParams.action || "";
            scope.accountId = routeParams.childId;
            scope.parentAccountId = routeParams.parentId;
            scope.formData = {};
            scope.restrictDate = new Date();
            // Transaction UI Related
            scope.isTransaction = false;
            scope.transactionAmountField = false;
            scope.showPaymentDetails = false;
            scope.paymentTypes = [];

            switch (scope.action) {
                case "approve":
                    scope.title = 'label.heading.approvesavingaccount';
                    scope.labelName = 'label.input.savingaccountapprovedOnDate';
                    scope.modelName = 'approvedOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'APPROVE_SAVINGSACCOUNT';
                    break;
                case "reject":
                    scope.title = 'label.heading.rejectsavingaccount';
                    scope.labelName = 'label.input.rejectedon';
                    scope.modelName = 'rejectedOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'REJECT_SAVINGSACCOUNT';
                    break;
                case "withdrawnByApplicant":
                    scope.title = 'label.heading.withdrawsavingaccount';
                    scope.labelName = 'label.input.withdrawnon';
                    scope.modelName = 'withdrawnOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'WITHDRAW_SAVINGSACCOUNT';
                    break;
                case "undoapproval":
                    scope.title = 'label.heading.undoapprovesavingaccount';
                    scope.showDateField = false;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'APPROVALUNDO_SAVINGSACCOUNT';
                    break;
                case "activate":
                    scope.title = 'label.heading.activatesavingaccount';
                    scope.labelName = 'label.input.activatedon';
                    scope.modelName = 'activatedOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.taskPermissionName = 'ACTIVATE_SAVINGSACCOUNT';
                    break;
                case "deposit":
                    resourceFactory.savingsTrxnsTemplateResource.get({savingsId: scope.accountId}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                    });
                    scope.title = 'label.heading.depositmoneytosavingaccount';
                    scope.labelName = 'label.input.transactiondate';
                    scope.modelName = 'transactionDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.isTransaction = true;
                    scope.transactionAmountField = true;
                    scope.showPaymentDetails = false;
                    scope.taskPermissionName = 'DEPOSIT_SAVINGSACCOUNT';
                    break;
                case "gsimDeposit":
                    scope.depositArray=[];
                    scope.showDepositTable=true;
                    scope.parentGSIM=[];
                    resourceFactory.savingsTrxnsTemplateResource.get({savingsId: scope.accountId}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                    });
                    resourceFactory.groupGSIMAccountResource.get({groupId: 2,parentGSIMId:scope.parentAccountId}, function (data) {
                        scope.gsimAccounts = data[0].childGSIMAccounts;
                        scope.parentGSIM=data[0];

                        if(scope.depositArray.length!=0)
                        {
                            scope.depositArray=[];

                        }
                        for(i=0;i<scope.gsimAccounts.length;i++)
                        {
                            var temp={};
                            temp.childAccountId=scope.gsimAccounts[i].id;
                            temp.accountNo=scope.gsimAccounts[i].accountNo;
                            temp.accountBalance=scope.gsimAccounts[i].accountBalance;
                            scope.depositArray.push(temp);

                        }
                    });
                    scope.title = 'label.heading.depositmoneytosavingaccount';
                    scope.labelName = 'label.input.transactiondate';
                    scope.modelName = 'transactionDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.isTransaction = true;
                    scope.showvoucherNumberField = false;
                    scope.showpaymentDescriptionField = false;
                    scope.transactionAmountField = true;
                    scope.showPaymentDetails = false;
                    scope.taskPermissionName = 'DEPOSIT_SAVINGSACCOUNT';
                    break;
                case "postInterestAsOn":
                    resourceFactory.savingsTrxnsTemplateResource.get({savingsId: scope.accountId}, function (data) {
                        scope.accountnumber=data.accountNo;
                    });
                    scope.labelName = 'label.input.transactiondate';
                    scope.modelName = 'transactionDate';
                    scope.showDateField = true;
                    scope.showAccountNumber=true;
                    break;
                case "withdrawal":
                    resourceFactory.savingsTrxnsTemplateResource.get({savingsId: scope.accountId}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                    });
                    scope.title = 'label.heading.withdrawmoneyfromsavingaccount';
                    scope.labelName = 'label.input.transactiondate';
                    scope.modelName = 'transactionDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.isTransaction = true;
                    scope.transactionAmountField = true;
                    scope.showPaymentDetails = false;
                    scope.taskPermissionName = 'WITHDRAWAL_SAVINGSACCOUNT';
                    break;
                case "applyAnnualFees":
                    resourceFactory.savingsResource.get({accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId},
                        function (data) {
                            scope.formData.amount = data.amount;
                            if (data.dueDate) {
                                var dueDate = dateFilter(data.dueDate, scope.df);
                                scope.formData.dueDate = new Date(dueDate);
                            }
                        });
                    scope.title = 'label.heading.savingaccountapplyannualFee';
                    scope.labelName = 'label.input.annualfeetransactiondate';
                    scope.modelName = 'dueDate';
                    scope.showDateField = true;
                    scope.showAnnualAmountField = true;
                    scope.showAmountField = false;
                    scope.showNoteField = false;
                    scope.taskPermissionName = 'APPLYANNUALFEE_SAVINGSACCOUNT';
                    break;
                case "close":
                    resourceFactory.savingsTrxnsTemplateResource.get({savingsId: scope.accountId}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                    });
                    resourceFactory.savingsResource.get({accountId: routeParams.id, fields:'summary'}, function (accountData) {
                        scope.accountBalance = accountData.summary.accountBalance;
                    });
                    scope.title = 'label.heading.closesavingaccount';
                    scope.labelName = 'label.input.closedon';
                    scope.modelName = 'closedOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.withdrawBalance = true;
                    scope.postInterestValidationOnClosure = true;
                    scope.formData.postInterestValidationOnClosure = true;
                    scope.taskPermissionName = 'CLOSE_SAVINGSACCOUNT';
                    break;
                case "modifytransaction":
                    resourceFactory.savingsTrxnsResource.get({savingsId: scope.accountId, transactionId: routeParams.transactionId, template: 'true'},
                        function (data) {
                            scope.title = 'label.heading.editsavingaccounttransaction';
                            scope.labelName = 'label.input.transactiondate';
                            scope.modelName = 'transactionDate';
                            scope.formData[scope.modelName] = new Date(data.date) || new Date();
                            scope.paymentTypes = data.paymentTypeOptions;
                            scope.formData.transactionAmount = data.amount;
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
                    scope.isTransaction = true;
                    scope.transactionAmountField = true;
                    scope.showPaymentDetails = false;
                    scope.taskPermissionName = 'ADJUSTTRANSACTION_SAVINGSACCOUNT';
                    break;
                case "editsavingcharge":
                    resourceFactory.savingsResource.get({accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId},
                        function (data) {
                            scope.formData.amount = data.amount;
                            if (data.feeOnMonthDay) {
                                scope.dateArray = [];
                                scope.dateArray.push(2013)
                                for (var i in data.feeOnMonthDay) {
                                    scope.dateArray.push(data.feeOnMonthDay[i]);
                                }
                                var feeOnMonthDay = dateFilter(scope.dateArray, scope.df);
                                scope.formData.feeOnMonthDayFullDate = new Date(feeOnMonthDay);
                                scope.labelName = 'label.heading.savingaccounttransactionDate';
                                scope.modelName = 'feeOnMonthDayFullDate';
                                scope.showDateField = true;
                                scope.showAnnualAmountField = true;
                                scope.showAmountField = false;
                            } else {
                                scope.labelName = 'label.input.amount';
                                scope.modelName = 'amount';
                                scope.showDateField = false;
                                scope.showAnnualAmountField = false;
                                scope.showAmountField = true;
                            }
                        });
                    scope.taskPermissionName = 'UPDATE_SAVINGSACCOUNTCHARGE';
                    break;
                case "deletesavingcharge":
                    scope.showDelete = true;
                    scope.taskPermissionName = 'DELETE_SAVINGSACCOUNTCHARGE';
                    break;
                case "paycharge":
                    scope.formData.dueDate = new Date();
                    resourceFactory.savingsResource.get({accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId,
                        command: 'paycharge'}, function (data) {
                        scope.formData.amount = data.amountOutstanding;
                    });
                    scope.labelName = 'label.input.amount';
                    scope.showAmountField = true;
                    scope.paymentDatefield = true;
                    scope.modelName = 'dueDate';
                    scope.taskPermissionName = 'PAY_SAVINGSACCOUNTCHARGE';
                    break;
                case "inactivate":
                    scope.inactivateCharge = true;
                    scope.taskPermissionName = 'INACTIVATE_SAVINGSACCOUNTCHARGE';
                    break;
                case "waive":
                    scope.waiveCharge = true;
                    scope.taskPermissionName = 'WAIVE_SAVINGSACCOUNTCHARGE';
                    break;
            }

            scope.cancel = function () {
                location.path('/viewgsimaccount/' + scope.groupId+'/'+scope.gsimAccountNumber);
            };

            scope.submit = function () {

                scope.savingsArray=[];
                scope.childAccounts=[];

                var params = {command: scope.action};
                if (scope.action != "undoapproval" && scope.action!="gsimDeposit") {
                    this.formData.locale = scope.optlang.code;
                    this.formData.dateFormat = scope.df;
                }

                if(scope.action=="gsimDeposit")
                {
                    for(var j=0;j<scope.gsimAccounts.length;j++)
                    {
                        if(scope.depositArray[j].transactionAmount)
                        {
                            var temp={};
                            temp.locale = scope.optlang.code;
                            temp.dateFormat = scope.df;
                            temp.transactionDate=dateFilter(this.formData.transactionDate, scope.df);
                            temp.transactionAmount=scope.depositArray[j].transactionAmount;
                            temp.childAccountId=scope.depositArray[j].childAccountId;
                            temp.voucherNumber=scope.depositArray[j].voucherNumber;
                            temp.paymentDescription=scope.depositArray[j].paymentDescription;
                            temp.paymentTypeId=scope.depositArray[j].paymentTypeId;
                            // scope.childAccounts.push(scope.gsimAccounts[j].id);
                            if(temp.transactionAmount!=0 )
                            {
                                scope.savingsArray.push(temp);
                            }
                        }
                    }

                    params.savingsId=scope.parentAccountId;
                    this.formData.savingsArray=scope.savingsArray;
                    this.formData.childAccounts=scope.childAccounts;

                    resourceFactory.savingsTrxnsResource.save(params, this.formData, function (data) {
                        location.path('/viewgsimaccount/' + scope.parentGSIM.groupId+'/'+scope.parentGSIM.accountNumber);

                    });
                }
                else
                if (scope.action == "deposit" || scope.action == "withdrawal" || scope.action == "modifytransaction" || scope.action=="postInterestAsOn") {
                    if (scope.action == "withdrawal") {
                        if (this.formData.transactionDate) {
                            this.formData.transactionDate = dateFilter(this.formData.transactionDate, scope.df);
                        }
                    } else if (scope.action == "deposit") {
                        if (this.formData.transactionDate) {
                            this.formData.transactionDate = dateFilter(this.formData.transactionDate, scope.df);
                        }
                    }
                    if (scope.action == "modifytransaction") {
                        params.command = 'modify';
                        if (this.formData.transactionDate) {
                            this.formData.transactionDate = dateFilter(this.formData.transactionDate, scope.df);
                        }
                        params.transactionId = routeParams.transactionId;
                    }
                    if(scope.action=="postInterestAsOn"){
                        if (this.formData.transactionDate) {
                            this.formData.transactionDate = dateFilter(this.formData.transactionDate, scope.df);
                        }
                        this.formData.isPostInterestAsOn=true;
                    }
                    params.savingsId = scope.accountId;

                    resourceFactory.savingsTrxnsResource.save(params, this.formData, function (data) {
                        location.path('/viewsavingaccount/' + data.savingsId);
                    });
                } else if (scope.action == "editsavingcharge") {
                    if (this.formData.feeOnMonthDayFullDate) {
                        this.formData.feeOnMonthDay = dateFilter(this.formData.feeOnMonthDayFullDate, scope.df);
                        this.formData.monthDayFormat = "dd MMM";
                        this.formData.feeOnMonthDay = this.formData.feeOnMonthDay.substring(0, this.formData.feeOnMonthDay.length - 5);
                        delete this.formData.feeOnMonthDayFullDate;
                    }
                    resourceFactory.savingsResource.update({accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId}, this.formData,
                        function (data) {
                            location.path('/viewsavingaccount/' + data.savingsId);
                        });
                } else if (scope.action == "deletesavingcharge") {
                    resourceFactory.savingsResource.delete({accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId}, this.formData,
                        function (data) {
                            location.path('/viewsavingaccount/' + data.savingsId);
                        });
                } else if (scope.action == "paycharge" || scope.action == "waive" || scope.action == "inactivate") {
                    params = {accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId, command: scope.action};
                    if (this.formData.dueDate) {
                        this.formData.dueDate = dateFilter(this.formData.dueDate, scope.df);
                    } else if(this.formData.inactivationOnDate){
                        this.formData.inactivationOnDate = dateFilter(this.formData.inactivationOnDate, scope.df);
                    }
                    resourceFactory.savingsResource.save(params, this.formData, function (data) {
                        location.path('/viewgsimaccount/' + scope.parentGSIM.groupId+'/'+scope.parentGSIM.accountNumber);
                    });
                } else {
                    params.parentAccountId = scope.parentAccountId;

                    if (scope.action == "approve") {
                        params.command='approve';
                        if (this.formData.approvedOnDate) {
                            this.formData.approvedOnDate = dateFilter(this.formData.approvedOnDate, scope.df);
                        }
                    } else if (scope.action == "withdrawnByApplicant") {
                        if (this.formData.withdrawnOnDate) {
                            this.formData.withdrawnOnDate = dateFilter(this.formData.withdrawnOnDate, scope.df);
                        }
                    } else if (scope.action == "reject") {
                        params.command='reject';
                        if (this.formData.rejectedOnDate) {
                            this.formData.rejectedOnDate = dateFilter(this.formData.rejectedOnDate, scope.df);
                        }
                    } else if (scope.action == "activate") {
                        if (this.formData.activatedOnDate) {
                            this.formData.activatedOnDate = dateFilter(this.formData.activatedOnDate, scope.df);
                        }
                    } else if (scope.action == "applyAnnualFees" || scope.action == "paycharge" || scope.action == "waivecharge") {
                        params = {accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId, command: 'paycharge'};
                        if (this.formData.dueDate) {
                            this.formData.dueDate = dateFilter(this.formData.dueDate, scope.df);
                        }
                    } else if (scope.action == "close") {

                        if (this.formData.closedOnDate) {
                            this.formData.closedOnDate = dateFilter(this.formData.closedOnDate, scope.df);
                        }
                    }

                    resourceFactory.gsimCommandsResource.save(params, this.formData, function (data) {
                        location.path('/viewgsimaccount/' + scope.groupId+'/'+scope.gsimAccountNumber);
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('GSIMAccountActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.GSIMAccountActionsController]).run(function ($log) {
        $log.info("GSIMAccountActionsController initialized");
    });
}(mifosX.controllers || {}));
