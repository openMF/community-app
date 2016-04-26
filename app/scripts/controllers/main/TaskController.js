(function (module) {
    mifosX.controllers = _.extend(module, {
        TaskController: function (scope, resourceFactory, route, dateFilter, $modal, location) {
            scope.clients = [];
            scope.sortType = '';
            scope.sortReverse = true;
            scope.loans = [];
            scope.offices = [];
            var idToNodeMap = {};
            scope.formData = {};
            scope.loanTemplate = {};
            scope.loanDisbursalTemplate = {};
            scope.date = {};
            scope.checkData = [];
            scope.isCollapsed = true;
            scope.approveData = {};
            scope.successfulquerytype = route.successfulquerytype;
            scope.restrictDate = new Date();
            //this value will be changed within each specific tab
            scope.requestIdentifier = "loanId";

            resourceFactory.checkerInboxResource.get({templateResource: 'searchtemplate'}, function (data) {
                scope.checkerTemplate = data;
            });
            resourceFactory.checkerInboxResource.search(function (data) {
                scope.searchData = data;
            });
            scope.hidesuccessfulquery = function(){
                scope.successfulquery = 0;
            }
            scope.sortableSubmittedOnDate = function(element){
                var input = element.timeline.submittedOnDate;
                if(input[1].toString().length==1){input[1]='0'+input[1];}
                if(input[2].toString().length==1){input[2]='0'+input[2];}
                return input[0].toString()+input[1].toString()+input[2].toString();
            }
            scope.sortableApprovedOnDate = function(element){
                var input = element.timeline.approvedOnDate;
                if(input[1].toString().length==1){input[1]='0'+input[1];}
                if(input[2].toString().length==1){input[2]='0'+input[2];}
                return input[0].toString()+input[1].toString()+input[2].toString();
            }
            scope.setloancount = function(number){
                if(number!=0){
                    scope.loancount=number;
                }
            }
            scope.checkClientQuery = function (clients) {
                if(typeof route.checkClientQuery !== 'undefined' && scope.successfulquerytype == 'label.heading.clientapproval'){
                    scope.pendingClients = [];
                    clients.forEach(function(client) {
                    if(client.active === false && client.status.value == 'Pending')
                        {scope.pendingClients.push(client);}
                    });
                    scope.unsuccessfulquery = [];
                    route.checkClientQuery.forEach(function(queryclientid){
                        var checkclientquerybool = false;
                        scope.pendingClients.forEach(function(pendingClient){
                            if(pendingClient.id==queryclientid){scope.unsuccessfulquery.push(pendingClient);}
                        });
                    });
                    scope.successfulquery = route.checkClientQuery.length-scope.unsuccessfulquery.length;
                    route.checkClientQuery = [];}
            };
            scope.checkLoanAQuery = function (office) {
                if((typeof route.checkBulkApproval !== 'undefined') && scope.successfulquerytype == 'label.heading.loanapproval'){
                    scope.failedAQuery = [];
                    office.forEach(function (client){
                        client.loans.forEach(function (loan) {
                            route.checkBulkApproval.forEach(function (checkid){
                                if(checkid == loan.id){
                                    scope.failedAQuery.push(loan);
                                }
                            });
                        });
                    });
                    scope.successfulquery = route.checkBulkApproval.length-scope.failedAQuery.length;
                    route.checkBulkApproval = [];
                }
            };
            scope.checkLoanDQuery = function (dloancheck) {
                if(typeof route.checkBulkDisbursal !== 'undefined' && scope.successfulquerytype == 'label.heading.loandisbursal'){
                    scope.failedDQuery = [];
                    dloancheck.forEach(function(check){
                        if(check.status.waitingForDisbursal===true){
                             route.checkBulkDisbursal.forEach(function(checkbulkid){
                                if(checkbulkid==check.id){
                                    scope.failedDQuery.push(check);
                                }
                             });
                        }
                    });
                    scope.successfulquery = route.checkBulkDisbursal.length-scope.failedDQuery.length;
                    route.checkBulkDisbursal = [];
                }
            };
            scope.viewUser = function (item) {
                scope.userTypeahead = true;
                scope.formData.user = item.id;
            };
            scope.checkerInboxAllCheckBoxesClicked = function() {
                var newValue = !scope.checkerInboxAllCheckBoxesMet();
                if(!angular.isUndefined(scope.searchData)) {
                    for (var i = scope.searchData.length - 1; i >= 0; i--) {
                        scope.checkData[scope.searchData[i].id] = newValue; 
                    };
                }
            }
            scope.checkerInboxAllCheckBoxesMet = function() {
                var checkBoxesMet = 0;
                if(!angular.isUndefined(scope.searchData)) {
                    _.each(scope.searchData, function(data) {
                        if(_.has(scope.checkData, data.id)) {
                            if(scope.checkData[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet===scope.searchData.length);
                }
            }
            scope.clientApprovalAllCheckBoxesClicked = function(officeName) {
                var newValue = !scope.clientApprovalAllCheckBoxesMet(officeName);
                if(!angular.isUndefined(scope.groupedClients[officeName])) {
                    for (var i = scope.groupedClients[officeName].length - 1; i >= 0; i--) {
                        scope.approveData[scope.groupedClients[officeName][i].id] = newValue; 
                    };
                }
            }
            scope.clientApprovalAllCheckBoxesMet = function(officeName) {
                var checkBoxesMet = 0;
                if(!angular.isUndefined(scope.groupedClients[officeName])) {
                    _.each(scope.groupedClients[officeName], function(data) {
                        if(_.has(scope.approveData, data.id)) {
                            if(scope.approveData[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet===scope.groupedClients[officeName].length);
                }
            }
            scope.loanApprovalAllCheckBoxesClicked = function(office) {
                var newValue = !scope.loanApprovalAllCheckBoxesMet(office);
                if(!angular.isUndefined(scope.offices)) {
                    for (var i = office.loans.length - 1; i >= 0; i--) {
                        scope.loanTemplate[office.loans[i].id] = newValue; 
                    };
                }
            }
        scope.setsortType = function(sortType){
            scope.sortType = sortType;
        }
        scope.sortReverseSwitch = function (){
            scope.sortReverse = !scope.sortReverse;
        }
            scope.loanApprovalAllCheckBoxesClicked = function(office) {
                var newValue = !scope.loanApprovalAllCheckBoxesMet(office);
                if(!angular.isUndefined(scope.offices)) {
                    for (var i = office.loans.length - 1; i >= 0; i--) {
                        scope.loanTemplate[office.loans[i].id] = newValue; 
                    };
                }
            }
            scope.loanApprovalAllCheckBoxesMet = function(office) {
                var checkBoxesMet = 0;
                if(!angular.isUndefined(scope.offices)) {
                    _.each(office.loans, function(data) {
                        if(_.has(scope.loanTemplate, data.id)) {
                            if(scope.loanTemplate[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet===office.loans.length);
                }
            }
            scope.loanDisbursalAllCheckBoxesClicked = function() {
                var newValue = !scope.loanDisbursalAllCheckBoxesMet();
                if(!angular.isUndefined(scope.loans)) {
                    for (var i = scope.loans.length - 1; i >= 0; i--) {
                        scope.loanDisbursalTemplate[scope.loans[i].id] = newValue; 
                    };
                }
            }
            scope.loanDisbursalAllCheckBoxesMet = function() {
                var checkBoxesMet = 0;
                if(!angular.isUndefined(scope.loans)) {
                    _.each(scope.loans, function(data) {
                        if(_.has(scope.loanDisbursalTemplate, data.id)) {
                            if(scope.loanDisbursalTemplate[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet===scope.loans.length);
                }
            }
            scope.approveOrRejectChecker = function (action) {
                if (scope.checkData) {
                    $modal.open({
                        templateUrl: 'approvechecker.html',
                        controller: CheckerApproveCtrl,
                        resolve: {
                            action: function () {
                                return action;
                            }
                        }
                    });
                }
            };
            var CheckerApproveCtrl = function ($scope, $modalInstance, action) {
                $scope.approve = function () {
                    var totalApprove = 0;
                    var approveCount = 0;
                    _.each(scope.checkData, function (value, key) {
                        if (value == true) {
                            totalApprove++;
                        }
                    });
                    _.each(scope.checkData, function (value, key) {
                        if (value == true) {

                            resourceFactory.checkerInboxResource.save({templateResource: key, command: action}, {}, function (data) {
                                approveCount++;
                                if (approveCount == totalApprove) {
                                    scope.search();
                                }
                            }, function (data) {
                                approveCount++;
                                if (approveCount == totalApprove) {
                                    scope.search();
                                }
                            });
                        }
                    });
                    scope.checkData = {};
                    $modalInstance.close('approve');

                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.deleteChecker = function () {
                if (scope.checkData) {
                    $modal.open({
                        templateUrl: 'deletechecker.html',
                        controller: CheckerDeleteCtrl
                    });
                }
            };
            var CheckerDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    var totalDelete = 0;
                    var deleteCount = 0
                    _.each(scope.checkData, function (value, key) {
                        if (value == true) {
                            totalDelete++;
                        }
                    });
                    _.each(scope.checkData, function (value, key) {
                        if (value == true) {

                            resourceFactory.checkerInboxResource.delete({templateResource: key}, {}, function (data) {
                                deleteCount++;
                                if (deleteCount == totalDelete) {
                                    scope.search();
                                }
                            }, function (data) {
                                deleteCount++;
                                if (deleteCount == totalDelete) {
                                    scope.search();
                                }
                            });
                        }
                    });
                    scope.checkData = {};
                    $modalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.approveClient = function () {
                if (scope.approveData) {
                    $modal.open({
                        templateUrl: 'approveclient.html',
                        controller: ApproveClientCtrl,
                        resolve: {
                            items: function () {
                                return scope.approveData;
                            }
                        }
                    });
                }
            };

            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $('.head-affix').css({
                        "position": "fixed",
                        "top": "50px"
                    });

                } else {
                    $('.head-affix').css({
                        position: 'static'
                    });
                }
            });

            var ApproveClientCtrl = function ($scope, $modalInstance, items) {
                $scope.restrictDate = new Date();
                $scope.date = {};
                $scope.date.actDate = new Date();
                $scope.approve = function (act) {
                    var activate = {}
                    activate.activationDate = dateFilter(act, scope.df);
                    activate.dateFormat = scope.df;
                    activate.locale = scope.optlang.code;
                    var totalClient = 0;
                    var clientCount = 0
                    _.each(items, function (value, key) {
                        if (value == true) {
                            totalClient++;
                        }
                    });

                    scope.batchRequests = [];
                    route.checkClientQuery = [];
                    route.successfulquerytype = 'label.heading.clientapproval'
                    scope.requestIdentifier = "clientId";

                    var reqId = 1;
                    _.each(items, function (value, key) {                         
                        if (value == true) {
                            scope.batchRequests.push({requestId: reqId++, relativeUrl: "clients/"+key+"?command=activate", 
                            method: "POST", body: JSON.stringify(activate)});
                            route.checkClientQuery.push(key);                       
                        }
                    });
                    
                    resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                        for(var i = 0; i < data.length; i++) {
                            if(data[i].statusCode = '200') {
                                clientCount++;
                                if (clientCount == totalClient) {
                                    route.reload();
                                }
                            }
                            
                        }    
                    });
                    $modalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.routeTo = function (id) {
                location.path('viewcheckerinbox/' + id);
            };

            scope.routeToClient = function (id) {
                location.path('viewclient/' + id);
            };

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                for (var i in data) {
                    data[i].loans = [];
                    idToNodeMap[data[i].id] = data[i];
                }
                scope.loanResource = function () {
                    resourceFactory.loanResource.getAllLoans(function (loanData) {
                        scope.loans = loanData.pageItems;
                        scope.checkLoanDQuery(loanData.pageItems);
                        for (var i in scope.loans) {
                            if (scope.loans[i].status.pendingApproval) {
                                var tempOffice = undefined;
                                if (scope.loans[i].clientOfficeId) {
                                    tempOffice = idToNodeMap[scope.loans[i].clientOfficeId];
                                    tempOffice.loans.push(scope.loans[i]);
                                } else {
                                    if (scope.loans[i].group) {
                                        tempOffice = idToNodeMap[scope.loans[i].group.officeId];
                                        tempOffice.loans.push(scope.loans[i]);
                                    }
                                }
                            }
                        }
                        scope.approveloancount=0;
                        var finalArray = [];
                        for (var i in scope.offices) {
                            if (scope.offices[i].loans && scope.offices[i].loans.length > 0) {
                                finalArray.push(scope.offices[i]);
                                scope.approveloancount=scope.approveloancount+scope.offices[i].loans.length;
                            }
                        }
                        scope.offices = finalArray;
                        scope.checkLoanAQuery(finalArray);
                    });
                };
                scope.loanResource();
            });


            resourceFactory.clientResource.getAllClients(function (data) {                
                scope.groupedClients = _.groupBy(data.pageItems, "officeName");
                //for count
                scope.nongroupedClients = data.pageItems;
                scope.checkClientQuery(data.pageItems);          
            });

            scope.search = function () {
                scope.isCollapsed = true;
                var reqFromDate = dateFilter(scope.date.from, 'yyyy-MM-dd');
                var reqToDate = dateFilter(scope.date.to, 'yyyy-MM-dd');
                var params = {};
                if (scope.formData.action) {
                    params.actionName = scope.formData.action;
                }
                ;

                if (scope.formData.entity) {
                    params.entityName = scope.formData.entity;
                }
                ;

                if (scope.formData.resourceId) {
                    params.resourceId = scope.formData.resourceId;
                }
                ;

                if (scope.formData.user) {
                    params.makerId = scope.formData.user;
                }
                ;

                if (scope.date.from) {
                    params.makerDateTimeFrom = reqFromDate;
                }
                ;

                if (scope.date.to) {
                    params.makerDateTimeto = reqToDate;
                }
                ;
                resourceFactory.checkerInboxResource.search(params, function (data) {
                    scope.searchData = data;
                    if (scope.userTypeahead) {
                        scope.formData.user = '';
                        scope.userTypeahead = false;
                        scope.user = '';
                    }
                });
            };

            scope.approveLoan = function () {
                if (scope.loanTemplate) {
                    $modal.open({
                        templateUrl: 'approveloan.html',
                        controller: ApproveLoanCtrl
                    });
                }
            };

            var ApproveLoanCtrl = function ($scope, $modalInstance) {
                $scope.approve = function () {
                    scope.bulkApproval();
                    route.reload();
                    $modalInstance.close('approve');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }

            scope.bulkApproval = function () {
                scope.formData.approvedOnDate = dateFilter(new Date(), scope.df);
                scope.formData.dateFormat = scope.df;
                scope.formData.locale = scope.optlang.code;
                var selectedAccounts = 0;
                var approvedAccounts = 0;
                _.each(scope.loanTemplate, function (value, key) {
                    if (value == true) {
                        selectedAccounts++;
                    }
                });

                scope.batchRequests = [];
                scope.requestIdentifier = "loanId";

                var reqId = 1;
                route.checkBulkApproval = [];
                route.successfulquerytype = 'label.heading.loanapproval'; 
                _.each(scope.loanTemplate, function (value, key) { 
                    if (value == true) {
                        scope.batchRequests.push({requestId: reqId++, relativeUrl: "loans/"+key+"?command=approve", 
                        method: "POST", body: JSON.stringify(scope.formData)});  
                        route.checkBulkApproval.push(key);                     
                    }
                });

                resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].statusCode = '200') {
                            approvedAccounts++;
                            data[i].body = JSON.parse(data[i].body);
                            scope.loanTemplate[data[i].body.loanId] = false;
                            if (selectedAccounts == approvedAccounts) {
                                scope.loanResource();
                            }
                        }
                        
                    }    
                });
            };

            scope.disburseLoan = function () {
                if (scope.loanDisbursalTemplate) {
                    $modal.open({
                        templateUrl: 'disburseloan.html',
                        controller: DisburseLoanCtrl
                    });
                }
            };

            var DisburseLoanCtrl = function ($scope, $modalInstance) {
                $scope.disburse = function () {
                    scope.bulkDisbursal();
                    route.reload();
                    $modalInstance.close('disburse');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }

            scope.bulkDisbursal = function () {
                scope.formData.actualDisbursementDate = dateFilter(new Date(), scope.df);
                scope.formData.dateFormat = scope.df;
                scope.formData.locale = scope.optlang.code;

                var selectedAccounts = 0;
                var approvedAccounts = 0;
                _.each(scope.loanDisbursalTemplate, function (value, key) {
                    if (value == true) {
                        selectedAccounts++;
                    }
                });

                scope.batchRequests = [];      
                scope.requestIdentifier = "loanId";          
                route.checkBulkDisbursal = [];
                var reqId = 1;
                route.successfulquerytype == 'label.heading.loandisbursal'
                _.each(scope.loanDisbursalTemplate, function (value, key) { 
                    if (value == true) {
                        scope.batchRequests.push({requestId: reqId++, relativeUrl: "loans/"+key+"?command=disburse", 
                        method: "POST", body: JSON.stringify(scope.formData)});
                        route.checkBulkDisbursal.push(key);                      
                    }
                });

                resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].statusCode = '200') {
                            approvedAccounts++;
                            data[i].body = JSON.parse(data[i].body);
                            scope.loanDisbursalTemplate[data[i].body.loanId] = false;
                            if (selectedAccounts == approvedAccounts) {
                                scope.loanResource();
                            }
                        }
                        
                    }    
                });
            };

        }
    });
    mifosX.ng.application.controller('TaskController', ['$scope', 'ResourceFactory', '$route', 'dateFilter', '$modal', '$location', mifosX.controllers.TaskController]).run(function ($log) {
        $log.info("TaskController initialized");
    });
}(mifosX.controllers || {}));
