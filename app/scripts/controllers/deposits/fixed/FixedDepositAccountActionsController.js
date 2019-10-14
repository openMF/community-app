(function (module) {
    mifosX.controllers = _.extend(module, {
        FixedDepositAccountActionsController: function (scope, resourceFactory, location, routeParams, dateFilter) {

            scope.action = routeParams.action || "";
            scope.accountId = routeParams.id;
            scope.savingAccountId = routeParams.id;
            scope.formData = {};
            scope.restrictDate = new Date();
            // Transaction UI Related
            scope.isAccountClose = false;
            scope.showPaymentDetails = false;
            scope.paymentTypes = [];
            scope.activationChargeAmount = 0;
            scope.totalAmountIncludingActivationCharge = 0;
            scope.depositAmount = 0;
            if(scope.action=='activate'){
                resourceFactory.fixedDepositAccountResource.get({accountId: scope.savingAccountId, associations:'charges'}, function (data) {
                        scope.totalAmountIncludingActivationCharge = data.depositAmount+parseFloat(data.activationCharge);
                        scope.depositAmount = data.depositAmount;
                        scope.activationChargeAmount = data.activationCharge;
                 });
            }

            switch (scope.action) {
                case "approve":
                    scope.title = 'label.heading.approvefixeddepositaccount';
                    scope.labelName = 'label.input.savingaccountapprovedOnDate';
                    scope.modelName = 'approvedOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.actionName = 'Approve application';
                    break;
                case "reject":
                    scope.title = 'label.heading.rejectfixeddepositaccount';
                    scope.labelName = 'label.input.rejectedon';
                    scope.modelName = 'rejectedOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.actionName = 'Reject application';
                    break;
                case "withdrawnByApplicant":
                    scope.title = 'label.heading.withdrawnfixeddepositaccount';
                    scope.labelName = 'label.input.withdrawnon';
                    scope.modelName = 'withdrawnOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.actionName = 'Withdrawn by applicant';
                    break;
                case "undoapproval":
                    scope.title = 'label.heading.undoapprovefixeddepositaccount';
                    scope.showDateField = false;
                    scope.showNoteField = true;
                    scope.actionName = 'Undo Approve application';
                    break;
                case "activate":
                    scope.title = 'label.heading.activatefixeddepositaccount';
                    scope.labelName = 'label.input.activatedon';
                    scope.modelName = 'activatedOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.actionName = 'Approve application';
                    break;
                /*case "deposit":
                 resourceFactory.savingsTrxnsTemplateResource.get({savingsId:scope.accountId, command:'deposit'}, function (data) {
                 scope.paymentTypes=data.paymentTypeOptions;
                 });
                 scope.title = 'label.heading.depositmoneytosavingaccount';
                 scope.labelName = 'label.input.transactiondate';
                 scope.modelName = 'transactionDate';
                 scope.showDateField = true;
                 scope.showNoteField = false;
                 scope.isTransaction = true;
                 scope.showPaymentDetails = false;
                 break;
                 case "withdrawal":
                 resourceFactory.savingsTrxnsTemplateResource.get({savingsId:scope.accountId, command:'withdrawal'}, function (data) {
                 scope.paymentTypes=data.paymentTypeOptions;
                 });
                 scope.title = 'label.heading.withdrawmoneyfromsavingaccount';
                 scope.labelName = 'label.input.transactiondate';
                 scope.modelName = 'transactionDate';
                 scope.showDateField = true;
                 scope.showNoteField = false;
                 scope.isTransaction = true;
                 scope.showPaymentDetails = false;
                 break;
                 case "applyAnnualFees":
                 resourceFactory.savingsResource.get({accountId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId},
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
                 break;*/
                case "close":
                    resourceFactory.fixedDepositAccountResource.get({accountId: routeParams.id, resourceType: 'template', command: 'close'},
                        function (data) {
                            scope.maturityAmount = data.maturityAmount;
                            scope.onAccountClosureOptions = data.onAccountClosureOptions;
                            scope.savingsAccounts = data.savingsAccounts;
                            scope.paymentTypes = data.paymentTypeOptions;
                            scope.currency = data.currency;
                        });
                    scope.title = 'label.heading.closefixeddepositaccount';
                    scope.labelName = 'label.input.closedon';
                    scope.modelName = 'closedOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.isAccountClose = true;
                    break;
                case "prematureClose":
                    scope.title = 'label.heading.prematureclosefixeddepositaccount';
                    scope.labelName = 'label.input.preMatureCloseOnDate';
                    scope.modelName = 'closedOnDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.retrievePreMatureAmount = true;
                    break;
                case "modifytransaction":
                    resourceFactory.fixedDepositTrxnsResource.get({savingsId: scope.accountId, transactionId: routeParams.transactionId, template: 'true'},
                        function (data) {
                            scope.title = 'label.heading.editfixeddepositaccounttransaction';
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
                    scope.showPaymentDetails = false;
                    scope.showPaymentType = true;
                    scope.showAmount = true;
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
                                scope.labelName = 'label.amount';
                                scope.modelName = 'amount';
                                scope.showDateField = false;
                                scope.showAnnualAmountField = false;
                                scope.showAmountField = true;
                            }
                        });
                    break;
                case "deletesavingcharge":
                    scope.showDelete = true;
                    break;
                case "paycharge":
                    scope.formData.dueDate = new Date();
                    resourceFactory.savingsResource.get({accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId,
                        command: 'paycharge'}, function (data) {
                        scope.formData.amount = data.amountOutstanding;
                    });
                    scope.labelName = 'label.amount';
                    scope.showAmountField = true;
                    scope.paymentDatefield = true;
                    scope.modelName = 'dueDate';
                    break;
                case "waive":
                    scope.waiveCharge = true;
                    break;
            }

            scope.cancel = function () {
                location.path('/viewfixeddepositaccount/' + routeParams.id);
            };

            scope.submit = function () {
                var params = {command: scope.action};
                if (scope.action != "undoapproval") {
                    this.formData.locale = scope.optlang.code;
                    this.formData.dateFormat = scope.df;
                }
                if (scope.action == "deposit" || scope.action == "withdrawal" || scope.action == "modifytransaction") {
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
                    params.savingsId = scope.accountId;
                    resourceFactory.fixedDepositTrxnsResource.save(params, this.formData, function (data) {
                        location.path('/viewfixeddepositaccount/' + data.savingsId);
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
                            location.path('/viewfixeddepositaccount/' + data.savingsId);
                        });
                } else if (scope.action == "deletesavingcharge") {
                    resourceFactory.savingsResource.delete({accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId}, this.formData,
                        function (data) {
                            location.path('/viewfixeddepositaccount/' + data.savingsId);
                        });
                } else if (scope.action == "paycharge" || scope.action == "waive") {
                    params = {accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId, command: scope.action};
                    if (this.formData.dueDate) {
                        this.formData.dueDate = dateFilter(this.formData.dueDate, scope.df);
                    }
                    resourceFactory.savingsResource.save(params, this.formData, function (data) {
                        location.path('/viewfixeddepositaccount/' + data.savingsId);
                    });
                } else {
                    params.accountId = scope.accountId;
                    if (scope.action == "approve") {
                        if (this.formData.approvedOnDate) {
                            this.formData.approvedOnDate = dateFilter(this.formData.approvedOnDate, scope.df);
                        }
                    } else if (scope.action == "withdrawnByApplicant") {
                        if (this.formData.withdrawnOnDate) {
                            this.formData.withdrawnOnDate = dateFilter(this.formData.withdrawnOnDate, scope.df);
                        }
                    } else if (scope.action == "reject") {
                        if (this.formData.rejectedOnDate) {
                            this.formData.rejectedOnDate = dateFilter(this.formData.rejectedOnDate, scope.df);
                        }
                    } else if (scope.action == "activate") {
                        if (this.formData.activatedOnDate) {
                            this.formData.activatedOnDate = dateFilter(this.formData.activatedOnDate, scope.df);
                        }
                        /*} else if (scope.action == "applyAnnualFees" || scope.action == "paycharge" || scope.action == "waivecharge") {
                         params = {accountId : routeParams.id, resourceType : 'charges', chargeId : routeParams.chargeId, command : 'paycharge'};
                         if (this.formData.dueDate) {
                         this.formData.dueDate = dateFilter(this.formData.dueDate,scope.df);
                         }*/
                    } else if (scope.action === "close") {
                        if (this.formData.closedOnDate) {
                            this.formData.closedOnDate = dateFilter(this.formData.closedOnDate, scope.df);
                        }
                    } else if (scope.action === "prematureClose") {

                        if (this.formData.closedOnDate) {
                            this.formData.closedOnDate = dateFilter(this.formData.closedOnDate, scope.df);
                        }
                        if (scope.retrievePreMatureAmount) {
                            params = {accountId: routeParams.id, command: 'calculatePrematureAmount'};
                            resourceFactory.fixedDepositAccountResource.save(params, this.formData, function (data) {
                                scope.maturityAmount = data.maturityAmount;
                                scope.onAccountClosureOptions = data.onAccountClosureOptions;
                                scope.savingsAccounts = data.savingsAccounts;
                                scope.paymentTypes = data.paymentTypeOptions;
                                scope.currency = data.currency;
                            });
                            scope.isAccountClose = true;
                            scope.showNoteField = true;
                            scope.retrievePreMatureAmount = false;
                            return;
                        }
                    }

                    resourceFactory.fixedDepositAccountResource.save(params, this.formData, function (data) {
                        location.path('/viewfixeddepositaccount/' + data.savingsId);
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('FixedDepositAccountActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.FixedDepositAccountActionsController]).run(function ($log) {
        $log.info("FixedDepositAccountActionsController initialized");
    });
}(mifosX.controllers || {}));
