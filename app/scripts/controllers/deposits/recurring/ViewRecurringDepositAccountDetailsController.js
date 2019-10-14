(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewRecurringDepositAccountDetailsController: function (scope, routeParams, resourceFactory, paginatorService, location, route, dateFilter,$uibModal) {
            scope.isDebit = function (savingsTransactionType) {
                return savingsTransactionType.withdrawal == true || savingsTransactionType.feeDeduction == true || savingsTransactionType.withholdTax == true;
            };

            /***
             * we are using orderBy(https://docs.angularjs.org/api/ng/filter/orderBy) filter to sort fields in ui
             * api returns dates in array format[yyyy, mm, dd], converting the array of dates to date object
             * @param dateFieldName
             */
            scope.convertDateArrayToObject = function(dateFieldName){
                for(var i in scope.savingaccountdetails.transactions){
                    scope.savingaccountdetails.transactions[i][dateFieldName] = new Date(scope.savingaccountdetails.transactions[i].date);
                }
            };
            scope.clickEvent = function (eventName, accountId) {
                eventName = eventName || "";
                switch (eventName) {
                    case "modifyapplication":
                        location.path('/editrecurringdepositaccount/' + accountId);
                        break;
                    case "approve":
                        location.path('/recurringdepositaccount/' + accountId + '/approve');
                        break;
                    case "reject":
                        location.path('/recurringdepositaccount/' + accountId + '/reject');
                        break;
                    case "withdrawnbyclient":
                        location.path('/recurringdepositaccount/' + accountId + '/withdrawnByApplicant');
                        break;
                    case "delete":
                        resourceFactory.recurringDepositAccountResource.delete({accountId: accountId}, {}, function (data) {
                            var destination = '/viewgroup/' + data.groupId;
                            if (data.clientId) destination = '/viewclient/' + data.clientId;
                            location.path(destination);
                        });
                        break;
                    case "undoapproval":
                        location.path('/recurringdepositaccount/' + accountId + '/undoapproval');
                        break;
                    case "activate":
                        location.path('/recurringdepositaccount/' + accountId + '/activate');
                        break;
                    case "deposit":
                        location.path('/recurringdepositaccount/' + accountId + '/deposit');
                        break;
                    case "withdraw":
                        location.path('/recurringdepositaccount/' + accountId + '/withdrawal');
                        break;
                    case "addcharge":
                        location.path('/recurringdepositaccount/' + accountId + '/charges');
                        break;
                    case "calculateInterest":
                        resourceFactory.recurringDepositAccountResource.save({accountId: accountId, command: 'calculateInterest'}, {}, function (data) {
                            route.reload();
                        });
                        break;
                    case "postInterest":
                        resourceFactory.recurringDepositAccountResource.save({accountId: accountId, command: 'postInterest'}, {}, function (data) {
                            route.reload();
                        });
                        break;
                    /*case "applyAnnualFees":
                        location.path('/savingaccountcharge/' + accountId + '/applyAnnualFees/' + scope.annualChargeId);
                        break;
                    case "transferFunds":
                        if (scope.savingaccountdetails.clientId) {
                            location.path('/accounttransfers/fromsavings/' + accountId);
                        }
                        break;*/
                    case "close":
                        location.path('/recurringdepositaccount/' + accountId + '/close');
                        break;
                    case "prematureClose":
                        location.path('/recurringdepositaccount/' + accountId + '/prematureClose');
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
                }
            };

            resourceFactory.recurringDepositAccountResource.get({accountId: routeParams.id, associations: 'all'}, function (data) {
                scope.savingaccountdetails = data;
                scope.savingaccountdetails.availableBalance = scope.savingaccountdetails.enforceMinRequiredBalance?(scope.savingaccountdetails.summary.accountBalance - scope.savingaccountdetails.minRequiredOpeningBalance):scope.savingaccountdetails.summary.accountBalance;
                scope.convertDateArrayToObject('date');
                scope.chartSlabs = scope.savingaccountdetails.accountChart.chartSlabs;
                scope.isprematureAllowed = data.maturityDate != null;
                scope.status = data.status.value;
                scope.heading = (!scope.savingaccountdetails.status.rejected && !scope.savingaccountdetails.status.submittedAndPendingApproval)?'label.heading.interestchart':'label.heading.summary';
                if (scope.status == "Submitted and pending approval" || scope.status == "Active" || scope.status == "Approved") {
                    scope.choice = true;
                }
                scope.chargeAction = data.status.value == "Submitted and pending approval" ? true : false;
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
                            icon: "fa fa-pencil "
                        },
                        {
                            name: "button.approve",
                            icon: "fa fa-check"
                        }
                    ],
                        options: [
                            {
                                name: "button.reject"
                            },
                            {
                                name: "button.withdrawnbyclient"
                            },
                            {
                                name: "button.addcharge"
                            },
                            {
                                name: "button.delete"
                            }
                        ]
                    };
                }

                if (data.status.value == "Approved") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.undoapproval",
                            icon: "fa fa-undo"
                        },
                        {
                            name: "button.activate",
                            icon: "fa fa-check"
                        }
                    ]
                    };
                }

                if (data.status.value == "Active") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.deposit",
                            icon: "fa fa-arrow-right"
                        },
                        {
                            name: "button.prematureClose",
                            icon: "fa fa-arrow-left"
                        },
                        {
                            name: "button.calculateInterest",
                            icon: "fa fa-table"
                        }
                    ],
                        options: [
                            {
                                name: "button.postInterest"
                            },
                            {
                                name: "button.addcharge"
                            }
                        ]

                    };

                    if (data.allowWithdrawal == true) {
                        scope.buttons.options.push({
                            name: "button.withdraw"
                        });
                    }
                    if (data.charges) {
                        for (var i in scope.charges) {
                            if (scope.charges[i].name == "Annual fee - INR") {
                                scope.buttons.options.push({
                                    name: "button.applyAnnualFees"
                                });
                                scope.annualChargeId = scope.charges[i].id;
                            }
                        }
                    }

                    if(!scope.isprematureAllowed){
                        scope.buttons.singlebuttons[1] = {
                            name: "button.close",
                            icon: "fa fa-arrow-right"
                        };
                    }

                    if(data.taxGroup){
                        if(data.withHoldTax){
                            scope.buttons.options.push({
                                name: "button.disableWithHoldTax",
                                taskPermissionName:"UPDATEWITHHOLDTAX_SAVINGSACCOUNT"
                            });
                        }else{
                            scope.buttons.options.push({
                                name: "button.enableWithHoldTax",
                                taskPermissionName:"UPDATEWITHHOLDTAX_SAVINGSACCOUNT"
                            });
                        }
                    }

                }

                if (data.status.value == "Matured") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.close",
                            icon: "fa fa-arrow-right"
                        },
                        {
                            name: "button.calculateInterest",
                            icon: "fa fa-table"
                        },
                        {
                            name: "button.postInterest",
                            icon: "fa fa-table"
                        }
                    ],
                        options: [
                            {
                                name: "button.addcharge"
                            }
                        ]

                    };
                    if (data.clientId) {
                        scope.buttons.options.push({
                            name: "button.transferFunds"
                        });
                    }
                    if (data.charges) {
                        for (var i in scope.charges) {
                            if (scope.charges[i].name == "Annual fee - INR") {
                                scope.buttons.options.push({
                                    name: "button.applyAnnualFees"
                                });
                                scope.annualChargeId = scope.charges[i].id;
                            }
                        }
                    }
                }


                /*var annualdueDate = [];
                 annualdueDate = data.annualFee.feeOnMonthDay;
                 annualdueDate.push(2013);
                 scope.annualdueDate = new Date(annualdueDate);*/
                resourceFactory.standingInstructionTemplateResource.get({fromClientId: scope.savingaccountdetails.clientId,fromAccountType: 2,fromAccountId: routeParams.id},function (response) {
                    scope.standinginstruction = response;
                    scope.searchTransaction();
                });
            });

            var fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = scope.optlang.code;
                params.fromAccountId = routeParams.id;
                params.fromAccountType = 2;
                params.clientId = scope.savingaccountdetails.clientId;
                params.clientName = scope.savingaccountdetails.clientName;
                params.dateFormat = scope.df;

                resourceFactory.standingInstructionResource.search(params, callback);
            };

            scope.searchTransaction = function () {
                scope.displayResults = true;
                scope.instructions = paginatorService.paginate(fetchFunction, 14);
                scope.isCollapsed = false;
            };

            scope.deletestandinginstruction = function (id) {
                $uibModal.open({
                    templateUrl: 'delInstruction.html',
                    controller: DelInstructionCtrl,
                    resolve: {
                        ids: function () {
                            return id;
                        }
                    }
                });
            };

            var DelInstructionCtrl = function ($scope, $uibModalInstance, ids) {
                $scope.delete = function () {
                    resourceFactory.standingInstructionResource.cancel({standingInstructionId: ids}, function (data) {
                        scope.searchTransaction();
                        $uibModalInstance.close('delete');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_savings_account'}, function (data) {
                scope.savingdatatables = data;
            });

            scope.routeTo = function (accountId, transactionId, accountTransfer, transferId) {
                if (accountTransfer) {
                    location.path('/viewaccounttransfers/' + transferId);
                } else {
                    location.path('/viewrecurringdepositaccounttrxn/' + accountId + '/' + transactionId);
                }
            };

            scope.dataTableChange = function (datatable) {
                resourceFactory.DataTablesResource.getTableDetails({datatablename: datatable.registeredTableName,
                    entityId: routeParams.id, genericResultSet: 'true'}, function (data) {
                    scope.datatabledetails = data;
                    scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                    scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;
                    scope.singleRow = [];
                    for (var i in data.columnHeaders) {
                        if (scope.datatabledetails.columnHeaders[i].columnCode) {
                            for (var j in scope.datatabledetails.columnHeaders[i].columnValues) {
                                for (var k in data.data) {
                                    if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                                        data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                                    }
                                }
                            }
                        }
                    }
                    if (scope.datatabledetails.isData) {
                        for (var i in data.columnHeaders) {
                            if (!scope.datatabledetails.isMultirow) {
                                var row = {};
                                row.key = data.columnHeaders[i].columnName;
                                row.value = data.data[0].row[i];
                                scope.singleRow.push(row);
                            }
                        }
                    }
                });
            };

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };

            scope.modifyTransaction = function (accountId, transactionId) {
                location.path('/recurringdepositaccount/' + accountId + '/modifytransaction?transactionId=' + transactionId);
            };

            scope.incentives = function(index){
                $uibModal.open({
                    templateUrl: 'incentive.html',
                    controller: IncentiveCtrl,
                    resolve: {
                        chartSlab: function () {
                            return scope.savingaccountdetails.accountChart.chartSlabs[index];
                        }
                    }
                });
            };

            var IncentiveCtrl = function ($scope, $uibModalInstance, chartSlab) {
                $scope.chartSlab = chartSlab;
                _.each($scope.chartSlab.incentives, function (incentive) {
                    if(!incentive.attributeValueDesc){
                        incentive.attributeValueDesc = incentive.attributeValue;
                    }
                });
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.transactionSort = {
                column: 'date',
                descending: true
            };
            scope.changeTransactionSort = function(column) {
                var sort = scope.transactionSort;
                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = true;
                }
            };

        }
    });
    mifosX.ng.application.controller('ViewRecurringDepositAccountDetailsController', ['$scope', '$routeParams', 'ResourceFactory', 'PaginatorService', '$location', '$route', 'dateFilter','$uibModal', mifosX.controllers.ViewRecurringDepositAccountDetailsController]).run(function ($log) {
        $log.info("ViewRecurringDepositAccountDetailsController initialized");
    });
}(mifosX.controllers || {}));
