(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewShareAccountController: function (scope, routeParams, resourceFactory, location, $uibModal, route, dateFilter, $sce, $rootScope, API_VERSION) {
            scope.report = false;
            scope.hidePentahoReport = true;
            scope.showActiveCharges = true;
            scope.formData = {};
            scope.date = {};
            scope.staffData = {};
            scope.fieldOfficers = [];
            scope.shareaccountdetails = [];

            scope.routeTo = function (savingsAccountId, transactionId, accountTransfer, transferId) {
                if (accountTransfer) {
                    location.path('/viewaccounttransfers/' + transferId);
                } else {
                    location.path('/viewsavingtrxn/' + savingsAccountId + '/trxnId/' + transactionId);
                }
            };

            /***
             * we are using orderBy(https://docs.angularjs.org/api/ng/filter/orderBy) filter to sort fields in ui
             * api returns dates in array format[yyyy, mm, dd], converting the array of dates to date object
             * @param dateFieldName
             */
            scope.convertDateArrayToObject = function(dateFieldName){
                for(var i in scope.shareaccountdetails.transactions){
                    scope.shareaccountdetails.transactions[i][dateFieldName] = new Date(scope.shareaccountdetails.transactions[i].date);
                }
            };
            scope.isRecurringCharge = function (charge) {
                return charge.chargeTimeType.value == 'Monthly Fee' || charge.chargeTimeType.value == 'Annual Fee' || charge.chargeTimeType.value == 'Weekly Fee';
            }

            scope.viewCharge = function (id){
                location.path('/savings/'+scope.shareaccountdetails.id+'/viewcharge/'+id).search({'status':scope.shareaccountdetails.status.value});
            }

            scope.clickEvent = function (eventName, accountId) {
                eventName = eventName || "";
                switch (eventName) {
                    case "modifyapplication":
                        location.path('/editshareaccount/' + accountId);
                        break;
                    case "approve":
                        location.path('/shareaccount/' + accountId + '/approve');
                        break;
                    case "reject":
                        location.path('/shareaccount/' + accountId + '/reject');
                        break;
                    case "delete":
                        resourceFactory.savingsResource.delete({accountId: accountId}, {}, function (data) {
                            var destination = '/viewgroup/' + data.groupId;
                            if (data.clientId) destination = '/viewclient/' + data.clientId;
                            location.path(destination);
                        });
                        break;
                    case "undoapproval":
                        location.path('/shareaccount/' + accountId + '/undoapproval');
                        break;
                    case "activate":
                        location.path('/shareaccount/' + accountId + '/activate');
                        break;
                    case "applyadditionalshares":
                        location.path('/shareaccount/' + accountId + '/applyadditionalshares');
                        break;
                    case "approveadditionalshares":
                        location.path('/shareaccount/' + accountId + '/approveadditionalshares');
                        break;
                    case "rejectadditionalshares":
                        location.path('/shareaccount/' + accountId + '/rejectadditionalshares');
                        break;
                    case "redeemshares":
                        location.path('/shareaccount/' + accountId + '/redeemshares');
                        break;
                    case "addcharge":
                        location.path('/shareaccount/' + accountId + '/charges');
                        break;
                    case "close":
                        location.path('/shareaccount/' + accountId + '/close');
                        break;
                    case "assignSavingsOfficer":
                        location.path('/assignshareofficer/' + accountId);
                        break;
                    case "unAssignSavingsOfficer":
                        location.path('/unassignshareofficer/' + accountId);
                        break;

                }
            };

            resourceFactory.sharesAccount.get({shareAccountId: routeParams.id}, function (data) {
                scope.shareaccountdetails = data;
                scope.convertDateArrayToObject('date');
                scope.staffData.staffId = data.staffId;
                scope.date.toDate = new Date();
                scope.date.fromDate = new Date(data.timeline.activatedDate);
                scope.status = data.status.value;

                if(scope.shareaccountdetails.dividends && scope.shareaccountdetails.dividends.length > 0) {
                    scope.showDividends = true ;
                    scope.dividends = scope.shareaccountdetails.dividends;
                }
                if (scope.status == "Submitted and pending approval" || scope.status == "Active" || scope.status == "Approved") {
                    scope.choice = true;
                }
                scope.chargeAction = data.status.value == "Submitted and pending approval" ? true : false;
                scope.chargePayAction = data.status.value == "Active" ? true : false;
                scope.sharesPendingForApproval = false ;

                if(scope.shareaccountdetails.purchasedShares) {
                    scope.purchasedShares = scope.shareaccountdetails.purchasedShares;
                    for (var i in scope.shareaccountdetails.purchasedShares) {
                        if(scope.shareaccountdetails.purchasedShares[i].status.code=='purchasedSharesStatusType.applied' &&
                            scope.shareaccountdetails.purchasedShares[i].type.code == 'purchasedSharesType.purchased') {
                            scope.sharesPendingForApproval = true ;
                            break ;
                        }
                    }
                    scope.purchasedSharesTableShow = true;
                }else {
                    scope.purchasedSharesTableShow = false;
                }
                if (scope.shareaccountdetails.charges) {
                    scope.charges = scope.shareaccountdetails.charges;
                    scope.chargeTableShow = true;
                } else {
                    scope.chargeTableShow = false;
                }
                if (data.status.value == "Submitted and pending approval") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.modifyapplication",
                            icon: "fa fa-pencil ",
                            taskPermissionName:"UPDATE_SHAREACCOUNT"
                        },
                        {
                            name: "button.approve",
                            icon: "fa fa-check",
                            taskPermissionName:"APPROVE_SHAREACCOUNT"
                        }
                    ],
                        options: [
                            {
                                name: "button.reject",
                                taskPermissionName:"REJECT_SHAREACCOUNT"
                            },
                            {
                                name: "button.delete",
                                taskPermissionName:"DELETE_SHAREACCOUNT"
                            }
                        ]
                    };
                }

                if (data.status.value == "Approved") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.undoapproval",
                            icon: "fa fa-undo",
                            taskPermissionName:"APPROVALUNDO_SHAREACCOUNT"
                        },
                        {
                            name: "button.activate",
                            icon: "fa fa-check",
                            taskPermissionName:"ACTIVATE_SHAREACCOUNT"
                        }
                    ]
                    };
                }
                if (data.status.value == "Active") {
                    if(scope.sharesPendingForApproval) {

                        scope.buttons = { singlebuttons: [
                            {
                                name:"button.applyadditionalshares",
                                icon:"fa fa-arrow-right",
                                taskPermissionName:"APPLYADDITIONAL_SHAREACCOUNT"
                            },
                            {
                                name:"button.approveadditionalshares",
                                icon:"fa fa-arrow-right",
                                taskPermissionName:"APPROVEADDITIONAL_SHAREACCOUNT"
                            },
                            {
                                name:"button.rejectadditionalshares",
                                icon:"fa fa-arrow-right",
                                taskPermissionName:"REJECTADDITIONAL_SHAREACCOUNT"
                            },
                            {
                                name: "button.redeemshares",
                                icon: "fa fa-arrow-left",
                                taskPermissionName:"WITHDRAW_SAVINGSACCOUNT"
                            },
                        ],
                            options: [
                                {
                                    name: "button.close",
                                    taskPermissionName:"CLOSE_SHAREACCOUNT"
                                }
                            ]

                        };

                    }else {
                        scope.buttons = { singlebuttons: [
                            {
                                name:"button.applyadditionalshares",
                                icon:"fa fa-arrow-right",
                                taskPermissionName:"APPLYADDITIONAL_SHAREACCOUNT"
                            },
                            {
                                name: "button.redeemshares",
                                icon: "fa fa-arrow-left",
                                taskPermissionName:"WITHDRAW_SAVINGSACCOUNT"
                            },
                        ],
                            options: [
                                {
                                    name: "button.close",
                                    taskPermissionName:"CLOSE_SHAREACCOUNT"
                                }
                            ]

                        };
                    }

                    if (data.charges) {
                        for (var i in scope.charges) {
                            if (scope.charges[i].name == "Annual fee - INR") {
                                scope.buttons.options.push({
                                    name: "button.applyAnnualFees",
                                    taskPermissionName:"APPLYANNUALFEE_SAVINGSACCOUNT"
                                });
                                scope.annualChargeId = scope.charges[i].id;
                            }
                        }
                    }
                }
            });

            scope.viewJournalEntries = function(){
                location.path("/searchtransaction/").search({savingsId: scope.shareaccountdetails.id});
            };

            scope.viewDataTable = function (registeredTableName,data){
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/"+registeredTableName+"/"+scope.shareaccountdetails.id+"/"+data.row[0]);
                }else{
                    location.path("/viewsingledatatableentry/"+registeredTableName+"/"+scope.shareaccountdetails.id);
                }
            };

            scope.viewSavingDetails = function () {

                scope.report = false;
                scope.hidePentahoReport = true;
                scope.viewReport = false;

            };

            scope.viewPrintDetails = function () {
                //scope.printbtn = true;
                scope.report = true;
                scope.viewTransactionReport = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Client Saving Transactions");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;

                var reportParams = "";
                scope.startDate = dateFilter(scope.date.fromDate, 'yyyy-MM-dd');
                scope.endDate = dateFilter(scope.date.toDate, 'yyyy-MM-dd');
                var paramName = "R_startDate";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.startDate)+ "&";
                paramName = "R_endDate";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.endDate)+ "&";
                paramName = "R_savingsAccountId";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.shareaccountdetails.accountNo);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }

                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.viewReportDetails = $sce.trustAsResourceUrl(scope.baseURL);

            };

            scope.viewSavingsTransactionReceipts = function (transactionId) {
                scope.report = true;
                scope.viewTransactionReport = true;
                scope.viewSavingReport = false;
                scope.printbtn = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Savings Transaction Receipt");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;

                var reportParams = "";
                var paramName = "R_transactionId";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(transactionId);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }
                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.viewReportDetails = $sce.trustAsResourceUrl(scope.baseURL);

            };
            scope.printReport = function () {
                window.print();
                window.close();
            };

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };

            scope.modifyTransaction = function (accountId, transactionId) {
                location.path('/savingaccount/' + accountId + '/modifytransaction?transactionId=' + transactionId);
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

            scope.checkStatus = function(){
                if(scope.status == 'Active' || scope.status == 'Closed' || scope.status == 'Transfer in progress' ||
                    scope.status == 'Transfer on hold' || scope.status == 'Premature Closed' || scope.status == 'Matured'){
                    return true;
                }
                return false;
            };

        }
    });
    mifosX.ng.application.controller('ViewShareAccountController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', '$route', 'dateFilter', '$sce', '$rootScope', 'API_VERSION', mifosX.controllers.ViewShareAccountController]).run(function ($log) {
        $log.info("ViewShareAccountController initialized");
    });
}(mifosX.controllers || {}));
