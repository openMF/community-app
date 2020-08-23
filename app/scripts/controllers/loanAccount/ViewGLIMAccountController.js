(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewGLIMaccountController: function (scope, routeParams, resourceFactory, location, route, http, $uibModal, dateFilter, API_VERSION, $sce, $rootScope) {

            var parentLoanAccountNo=routeParams.id;
            scope.groupId=routeParams.groupId;
            scope.glimId=routeParams.glimId;
            scope.groupGLIMAccounts={};
            scope.productName="";
            scope.buttons={};
            scope.routeToLoan = function (id) {
                location.path('/viewloanaccount/' + id);
            };

            var parentglimid=0;



            resourceFactory.glimLoanTemplate.get({glimId: scope.glimId}, function (data) {

                scope.glimAccounts = data;

                for(i=0;i<scope.glimAccounts.length;i++)
                {

                    var temp={};
                    temp.parentAccountNo=data[i].parentAccountNo;
                    temp.clientName=data[i].clientName;
                    temp.childLoanId=data[i].childLoanId;
                    temp.childLoanAccountNo=data[i].childLoanAccountNo;
                    temp.approvedLoanAmount=parseFloat(data[i].childPrincipalAmount);

                    scope.totalLoanAmount+=parseFloat(data[i].childPrincipalAmount);


                    scope.approvalArray.push(temp);
                }
            });


            resourceFactory.groupGLIMAccountResource.get({groupId: routeParams.groupId,parentLoanAccountNo:parentLoanAccountNo }, function (data) {
                scope.groupGLIMAccounts = data[0];
                scope.productName=data[0].childGLIMAccounts[0].productName;
                parentglimid=data[0].childGLIMAccounts[0].id;
                scope.id=data[0].childGLIMAccounts[0].id;
                scope.submittedOnDate=data[0].childGLIMAccounts[0].timeline.submittedOnDate;
                scope.value=data[0].childGLIMAccounts[0].status.value;

                if (scope.groupGLIMAccounts.loanStatus === "SUBMITTED_AND_PENDING_APPROVAL") {

                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.approve",
                            icon: "fa fa-check",
                            taskPermissionName: 'APPROVE_LOAN'
                        },
                        {
                            name: "button.reject",
                            icon: "fa fa-times",
                            taskPermissionName: 'REJECT_LOAN'
                        }
                    ]
                    };
                }

                if (data[0].loanStatus === "APPROVED") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.disburse",
                            icon: "fa fa-flag",
                            taskPermissionName: 'DISBURSE_LOAN'
                        },
                        {
                            name: "button.undoapproval",
                            icon: "fa fa-undo",
                            taskPermissionName: 'APPROVALUNDO_LOAN'
                        }
                    ]
                    };
                }

                if (data[0].loanStatus === "ACTIVE") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.makerepayment",
                            icon: "fa fa-dollar",
                            taskPermissionName: 'REPAYMENT_LOAN'
                        },
                        {
                            name: "button.undodisbursal",
                            icon: "fa fa-undo",
                            taskPermissionName: 'DISBURSALUNDO_LOAN'
                        }
                    ]
                    };
                }
            });

            scope.clickEvent = function (eventName, accountId) {
                eventName = eventName || "";
                switch (eventName) {
                    case "addloancharge":
                        location.path('/addloancharge/' + accountId);
                        break;
                    case "addcollateral":
                        location.path('/addcollateral/' + accountId);
                        break;
                    case "assignloanofficer":
                        location.path('/assignloanofficer/' + accountId);
                        break;
                    case "modifyapplication":
                        location.path('/editloanaccount/' + parentglimid);
                        break;
                    case "approve":
                        location.path('/glimloanaccount/' + routeParams.id + '/glimApprove/'+accountId +'/'+scope.groupId);   //accountid is glimId and  routerparamsid is child loanid
                        break;
                    case "reject":
                        location.path('/glimloanaccount/' + routeParams.id +'/reject/'+accountId+'/'+scope.groupId);
                        break;
                    case "withdrawnbyclient":
                        location.path('/loanaccount/' + accountId + '/withdrawnByApplicant');
                        break;
                    case "delete":
                        resourceFactory.LoanAccountResource.delete({loanId: accountId}, {}, function (data) {
                            var destination = '/viewgroup/' + data.groupId;
                            if (data.clientId) destination = '/viewclient/' + data.clientId;
                            location.path(destination);
                        });
                        break;
                    case "undoapproval":
                        location.path('/glimloanaccount/' + routeParams.id + '/undoapproval/'+ accountId +'/'+scope.groupId);
                        break;
                    case "disburse":
                        location.path('/glimloanaccount/' + routeParams.id + '/glimDisburse/'+accountId+'/'+scope.groupId);
                        break;
                    case "disbursetosavings":
                        location.path('/loanaccount/' + accountId + '/disbursetosavings');
                        break;
                    case "undodisbursal":
                        location.path('/glimloanaccount/'+ routeParams.id + '/undodisbursal/'+ accountId +'/'+scope.groupId);
                        break;
                    case "makerepayment":
                        location.path('/glimloanaccount/' + routeParams.id + '/glimrepayment/'+accountId+'/'+scope.groupId);
                        break;
                    case "prepayment":
                        location.path('/loanaccount/' + accountId + '/prepayloan');
                        break;
                    case "waiveinterest":
                        location.path('/loanaccount/' + accountId + '/waiveinterest');
                        break;
                    case "writeoff":
                        location.path('/loanaccount/' + accountId + '/writeoff');
                        break;
                    case "recoverypayment":
                        location.path('/loanaccount/' + accountId + '/recoverypayment');
                        break;
                    case "close-rescheduled":
                        location.path('/loanaccount/' + accountId + '/close-rescheduled');
                        break;
                    case "transferFunds":
                        if (scope.loandetails.clientId) {
                            location.path('/accounttransfers/fromloans/' + accountId);
                        }
                        break;
                    case "close":
                        location.path('/loanaccount/' + accountId + '/close');
                        break;
                    case "createguarantor":
                        location.path('/guarantor/' + accountId);
                        break;
                    case "listguarantor":
                        location.path('/listguarantors/' + accountId);
                        break;
                    case "recoverguarantee":
                        location.path('/loanaccount/' + accountId + '/recoverguarantee');
                        break;
                    case "unassignloanofficer":
                        location.path('/loanaccount/' + accountId + '/unassignloanofficer');
                        break;
                    case "loanscreenreport":
                        location.path('/loanscreenreport/' + accountId);
                        break;
                    case "reschedule":
                        location.path('/loans/' +accountId + '/reschedule');
                        break;
                    case "adjustrepaymentschedule":
                        location.path('/adjustrepaymentschedule/'+accountId) ;
                        break ;
                    case "foreclosure":
                        location.path('loanforeclosure/' + accountId);
                        break;
                }
            };

            resourceFactory.groupResource.get({groupId: routeParams.groupId, associations: 'all'}, function (data) {
                scope.group = data;

            });
        }
    });
    mifosX.ng.application.controller('ViewGLIMaccountController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', '$http', '$uibModal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', mifosX.controllers.ViewGLIMaccountController]).run(function ($log) {
        $log.info("ViewGLIMaccountController initialized");
    });
}(mifosX.controllers || {}));
