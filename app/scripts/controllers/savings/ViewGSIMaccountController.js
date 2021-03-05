(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewGSIMaccountController: function (scope, routeParams, route, location, resourceFactory, dateFilter, $uibModal) {

            scope.groupId=routeParams.groupId;
            scope.gsimAccountNumber=routeParams.gsimAccountNumber;
            scope.savingaccountdetails = [];
            var gsimChildAccountId=0;
            scope.staffData = {};
            scope.formData = {};
            scope.date = {};
            var parentGSIMId=0;


            scope.convertDateArrayToObject = function(dateFieldName){
                for(var i in scope.savingaccountdetails.transactions){
                    scope.savingaccountdetails.transactions[i][dateFieldName] = new Date(scope.savingaccountdetails.transactions[i].date);
                }
            };

            resourceFactory.groupGSIMAccountResource.get({groupId: scope.groupId,parentGSIMAccountNo:scope.gsimAccountNumber}, function (data) {
                scope.groupAccounts = data[0];
                gsimChildAccountId=data[0].childGSIMAccounts[0].id;
                parentGSIMId=scope.groupAccounts.gsimId;

                resourceFactory.savingsResource.get({accountId: gsimChildAccountId, associations: 'all'}, function (data) {
                    scope.savingaccountdetails = data;
                    scope.convertDateArrayToObject('date');
                    if(scope.savingaccountdetails.groupId) {
                        resourceFactory.groupResource.get({groupId: scope.savingaccountdetails.groupId}, function (data) {
                            scope.groupLevel = data.groupLevel;
                        });
                    }
                    scope.showonhold = true;
                    if(angular.isUndefined(data.onHoldFunds)){
                        scope.showonhold = false;
                    }
                    scope.staffData.staffId = data.staffId;
                    scope.date.toDate = new Date();
                    scope.date.fromDate = new Date(data.timeline.activatedOnDate);

                    scope.status = data.status.value;
                    if (scope.status == "Submitted and pending approval" || scope.status == "Active" || scope.status == "Approved") {
                        scope.choice = true;
                    }
                    scope.chargeAction = data.status.value == "Submitted and pending approval" ? true : false;
                    scope.chargePayAction = data.status.value == "Active" ? true : false;
                    if (scope.savingaccountdetails.charges) {
                        scope.charges = scope.savingaccountdetails.charges;
                        scope.chargeTableShow = true;
                    } else {
                        scope.chargeTableShow = false;
                    }
                    if (data.status.value == "Submitted and pending approval") {
                        scope.buttons = { singlebuttons: [
                            {
                                name: "button.modifyapplication",
                                icon: "fa fa-pencil ",
                                taskPermissionName:"UPDATE_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.approve",
                                icon: "fa fa-check",
                                taskPermissionName:"APPROVE_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.reject",
                                icon: "fa fa-remove-circle",
                                taskPermissionName:"REJECT_SAVINGSACCOUNT"
                            }
                        ]
                        };
                    }

                    if (data.status.value == "Approved") {
                        scope.buttons = { singlebuttons: [
                            {
                                name: "button.undoapproval",
                                icon: "fa faf-undo",
                                taskPermissionName:"APPROVALUNDO_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.activate",
                                icon: "fa fa-check",
                                taskPermissionName:"ACTIVATE_SAVINGSACCOUNT"
                            }
                        ]
                        };
                    }

                    if (data.status.value == "Active") {
                        scope.buttons = { singlebuttons: [

                            {
                                name: "button.deposit",
                                icon: "fa fa-arrow-right",
                                taskPermissionName:"DEPOSIT_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.close",
                                icon :"fa fa-ban-circle",
                                taskPermissionName:"CLOSE_SAVINGSACCOUNT"
                            }
                        ]
                        };
                    }
                    if (data.annualFee) {
                        var annualdueDate = [];
                        annualdueDate = data.annualFee.feeOnMonthDay;
                        annualdueDate.push(new Date().getFullYear());
                        scope.annualdueDate = new Date(annualdueDate);
                    };
                });
            });

            scope.routeToSaving = function (id) {
                location.path('/viewsavingaccount/' + id);
            };
            console.log("outer"+parentGSIMId);

            scope.clickEvent = function (eventName, accountId) {
                eventName = eventName || "";
                switch (eventName) {
                    case "modifyapplication":
                        location.path('/editgsimaccount/' + parentGSIMId+'/'+gsimChildAccountId+'/'+scope.groupId+'/'+scope.gsimAccountNumber);
                        break;
                    case "approve":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+ '/approve/'+scope.groupId+'/'+scope.gsimAccountNumber);
                        break;
                    case "reject":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+ '/reject/'+scope.groupId+'/'+scope.gsimAccountNumber);
                        break;
                    case "withdrawnbyclient":
                        location.path('/savingaccount/' + accountId + '/withdrawnByApplicant');
                        break;
                    case "delete":
                        resourceFactory.savingsResource.delete({accountId: accountId}, {}, function (data) {
                            var destination = '/viewgroup/' + data.groupId;
                            if (data.clientId) destination = '/viewclient/' + data.clientId;
                            location.path(destination);
                        });
                        break;
                    case "undoapproval":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+ '/undoapproval/'+scope.groupId+'/'+scope.gsimAccountNumber);
                        break;
                    case "activate":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+ '/activate/'+scope.groupId+'/'+scope.gsimAccountNumber);
                        break;
                    case "deposit":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+  '/gsimDeposit/'+scope.groupId+'/'+scope.gsimAccountNumber);
                        break;
                    case "withdraw":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+  '/gsimWithdrawal/'+scope.groupId+'/'+scope.gsimAccountNumber);
                        break;
                    case "addcharge":
                        location.path('/savingaccounts/' + accountId + '/charges');
                        break;
                    case "calculateInterest":
                        resourceFactory.savingsResource.save({accountId: accountId, command: 'calculateInterest'}, {}, function (data) {
                            route.reload();
                        });
                        break;
                    case "postInterest":
                        resourceFactory.savingsResource.save({accountId: accountId, command: 'postInterest'}, {}, function (data) {
                            route.reload();
                        });
                        break;
                    case "applyAnnualFees":
                        location.path('/savingaccountcharge/' + accountId + '/applyAnnualFees/' + scope.annualChargeId);
                        break;
                    case "transferFunds":
                        if (scope.savingaccountdetails.clientId) {
                            location.path('/accounttransfers/fromsavings/' + accountId);
                        }
                        break;
                    case "close":
                        location.path('/gsimaccount/'+parentGSIMId +'/'+gsimChildAccountId+ '/close');
                        break;
                    case "assignSavingsOfficer":
                        location.path('/assignsavingsofficer/' + accountId);
                        break;
                    case "unAssignSavingsOfficer":
                        location.path('/unassignsavingsofficer/' + accountId);
                        break;
                    case "enableWithHoldTax":
                        var changes = {
                            withHoldTax:true
                        };
                        resourceFactory.savingsResource.update({accountId: accountId, command: 'updateWithHoldTax'}, changes, function (data) {
                            route.reload();
                        });
                        break;
                    case "disableWithHoldTax":
                        var changes = {
                            withHoldTax:false
                        };
                        resourceFactory.savingsResource.update({accountId: accountId, command: 'updateWithHoldTax'}, changes, function (data) {
                            route.reload();
                        });
                        break;
                    case "postInterestAsOn":
                        location.path('/savingaccount/' + accountId + '/postInterestAsOn');
                        break;
                }
            };

        }
    });
    mifosX.ng.application.controller('ViewGSIMaccountController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', 'dateFilter', '$uibModal', mifosX.controllers.ViewGSIMaccountController]).run(function ($log) {
        $log.info("ViewGSIMaccountController initialized");
    });
}(mifosX.controllers || {}));
