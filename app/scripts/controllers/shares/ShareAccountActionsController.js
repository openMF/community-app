(function (module) {
    mifosX.controllers = _.extend(module, {
        ShareAccountActionsController: function (scope, resourceFactory, location, routeParams, dateFilter) {

            scope.action = routeParams.action || "";
            scope.accountId = routeParams.accountId;
            scope.shareAccountId = routeParams.accountId;
            scope.purchasedSharesId = routeParams.purchasedSharesId ;
            scope.formData = {};
            scope.restrictDate = new Date();
            // Transaction UI Related
            scope.isTransaction = false;
            scope.transactionAmountField = false;
            scope.showPaymentDetails = false;
            scope.paymentTypes = [];

            switch (scope.action) {
                case "approve":
                    scope.title = 'label.heading.approveshareaccount';
                    scope.labelName = 'label.input.savingaccountapprovedOnDate';
                    scope.modelName = 'approvedDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'APPROVE_SHAREACCOUNT';
                    break;
                case "reject":
                    scope.title = 'label.heading.rejectshareaccount';
                    scope.labelName = 'label.input.rejectedon';
                    scope.modelName = 'rejectedDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'REJECT_SHARESACCOUNT';
                    break;
                case "undoapproval":
                    scope.title = 'label.heading.undoapproveshareaccount';
                    scope.showDateField = false;
                    scope.showNoteField = false;
                    scope.taskPermissionName = 'UNDOAPPROVAL_SHAREACCOUNT';
                    break;
                case "activate":
                    scope.title = 'label.heading.activateshareaccount';
                    scope.labelName = 'label.input.activatedon';
                    scope.modelName = 'activatedDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.taskPermissionName = 'ACTIVATE_SHAREACCOUNT';
                    break;
                case "applyadditionalshares":
                    resourceFactory.sharesAccount.get({shareAccountId: routeParams.accountId}, function (data) {
                        scope.shareaccountdetails = data;
                        scope.formData.unitPrice = data.currentMarketPrice ;
                    }) ;
                    scope.title = 'label.heading.applyadditionalshares';
                    scope.labelName = 'label.input.requesteddate';
                    scope.modelName = 'requestedDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.requestedShares = true ;
                    scope.taskPermissionName = 'APPROVE_SHAREACCOUNT';
                    break ;
                case "approveadditionalshares":
                    resourceFactory.sharesAccount.get({shareAccountId: routeParams.accountId}, function (data) {
                        scope.shareaccountdetails = data;
                        var purchasedShares = [] ;
                        for(var i in data.purchasedShares) {
                            if(scope.shareaccountdetails.purchasedShares[i].status.code=='purchasedSharesStatusType.applied' &&
                                scope.shareaccountdetails.purchasedShares[i].type.code == 'purchasedSharesType.purchased') {
                                purchasedShares.push(data.purchasedShares[i]) ;
                            }
                        }
                        scope.purchasedShares = purchasedShares ;
                    }) ;
                    scope.title = 'label.heading.approvesharespurchase';
                    scope.labelName = 'label.input.savingaccountapprovedOnDate';
                    scope.modelName = 'approvedDate';
                    scope.showDateField = false;
                    scope.showNoteField = false;
                    scope.showPendingShares = true ;
                    scope.taskPermissionName = 'APPROVEADDITIONALSHARES';
                    break;

                case "rejectadditionalshares":
                    resourceFactory.sharesAccount.get({shareAccountId: routeParams.accountId}, function (data) {
                        var purchasedShares = [] ;
                        scope.shareaccountdetails = data;
                        for(var i in data.purchasedShares) {
                            if(scope.shareaccountdetails.purchasedShares[i].status.code=='purchasedSharesStatusType.applied' &&
                                scope.shareaccountdetails.purchasedShares[i].type.code == 'purchasedSharesType.purchased') {
                                purchasedShares.push(data.purchasedShares[i]) ;
                            }
                        }
                        scope.purchasedShares = purchasedShares ;
                    }) ;
                    scope.title = 'label.heading.rejectsharespurchase';
                    scope.modelName = 'approvedDate';
                    scope.showDateField = false;
                    scope.showNoteField = false;
                    scope.showPendingShares = true ;
                    scope.taskPermissionName = 'REJECTADDITIONALSHARES';
                    break;

                case "redeemshares":
                    resourceFactory.sharesAccount.get({shareAccountId: routeParams.accountId}, function (data) {
                        scope.shareaccountdetails = data;
                        scope.formData.unitPrice = data.currentMarketPrice ;
                    }) ;
                    scope.title = 'label.button.redeemshares';
                    scope.labelName = 'label.input.requesteddate';
                    scope.modelName = 'requestedDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.requestedShares = true ;
                    scope.taskPermissionName = 'APPROVE_SHAREACCOUNT';
                    break ;
                case "close":
                   /* resourceFactory.savingsTrxnsTemplateResource.get({savingsId: scope.accountId}, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                    });
                    resourceFactory.savingsResource.get({accountId: routeParams.id, fields:'summary'}, function (accountData) {
                        scope.accountBalance = accountData.summary.accountBalance;
                    });*/
                    scope.title = 'label.heading.closeshareaccount';
                    scope.labelName = 'label.input.closedon';
                    scope.modelName = 'closedDate';
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.withdrawBalance = false;
                    scope.taskPermissionName = 'CLOSE_SHAREACCOUNT';
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
                location.path('/viewshareaccount/' + routeParams.accountId);
            };

            scope.submit = function () {
                var params = {command: scope.action};
                if (scope.action != "undoapproval") {
                    this.formData.locale = scope.optlang.code;
                    this.formData.dateFormat = scope.df;
                }
                 if (scope.action == "editsavingcharge") {
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
                        location.path('/viewsavingaccount/' + data.savingsId);
                    });
                } else {
                    params.shareAccountId = scope.accountId;
                    if (scope.action == "approve") {
                        if (this.formData.approvedDate) {
                            this.formData.approvedDate = dateFilter(this.formData.approvedDate, scope.df);
                        }
                    } else if (scope.action == "reject") {
                        if (this.formData.rejectedOnDate) {
                            this.formData.rejectedOnDate = dateFilter(this.formData.rejectedOnDate, scope.df);
                        }
                    } else if (scope.action == "activate") {
                        if (this.formData.activatedDate) {
                            this.formData.activatedDate = dateFilter(this.formData.activatedDate, scope.df);
                        }
                    } else if (scope.action == "close") {
                        if (this.formData.closedDate) {
                            this.formData.closedDate = dateFilter(this.formData.closedDate, scope.df);
                        }
                    }else if(scope.action == 'applyadditionalshares') {
                        this.formData.requestedDate = dateFilter(this.formData.requestedDate, scope.df);
                    }else if(scope.action == 'approveadditionalshares') {
                        this.formData.requestedDate = dateFilter(this.formData.requestedDate, scope.df);
                        var requestedShares = [] ;
                        for(var i in scope.purchasedShares) {
                            if(scope.purchasedShares[i].isApproved) {
                                var obj = {} ;
                                obj.id = scope.purchasedShares[i].id ;
                                requestedShares.push(obj) ;
                            }
                        }
                        this.formData.requestedShares = requestedShares ;
                    }else if(scope.action == 'rejectadditionalshares') {
                        var requestedShares = [] ;
                        for(var i in scope.purchasedShares) {
                            if(scope.purchasedShares[i].isApproved) {
                                var obj = {} ;
                                obj.id = scope.purchasedShares[i].id ;
                                requestedShares.push(obj) ;
                            }
                        }
                        this.formData.requestedShares = requestedShares ;
                    }else if(scope.action == 'redeemshares') {
                        this.formData.requestedDate = dateFilter(this.formData.requestedDate, scope.df);
                    }
                    resourceFactory.sharesAccount.save(params, this.formData, function (data) {
                        location.path('/viewshareaccount/' + data.resourceId);
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('ShareAccountActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ShareAccountActionsController]).run(function ($log) {
        $log.info("ShareAccountActionsController initialized");
    });
}(mifosX.controllers || {}));
