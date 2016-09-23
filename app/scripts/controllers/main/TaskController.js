(function (module) {
    mifosX.controllers = _.extend(module, {
        TaskController: function (scope, resourceFactory, route, dateFilter, $modal, location) {
            scope.clients = [];
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
            scope.restrictDate = new Date();
            //this value will be changed within each specific tab
            scope.requestIdentifier = "loanId";

            resourceFactory.checkerInboxResource.get({templateResource: 'searchtemplate'}, function (data) {
                scope.checkerTemplate = data;
            });
            resourceFactory.checkerInboxResource.search(function (data) {
                scope.searchData = data;
            });
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });
            scope.viewUser = function (item) {
                scope.userTypeahead = true;
                scope.formData.user = item.id;
            };
            scope.loanOfficerSelected = function (loanOfficerId) {
                delete this.centerId;
                delete this.groupId;
                if (loanOfficerId) {
                    resourceFactory.centerResource.getAllCenters({officeId: this.officeId, staffId: loanOfficerId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.centers = data;
                    });

                    resourceFactory.groupResource.getAllGroups({officeId: this.officeId, staffId: loanOfficerId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.groups = data;
                    });
                } else {
                    resourceFactory.centerResource.getAllCenters({officeId: this.officeId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.centers = data;
                    });

                    resourceFactory.groupResource.getAllGroups({officeId: this.officeId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.groups = data;
                    });
                }
            };
            scope.officeSelected = function (officeId) {

                delete this.loanOfficerId;
                delete this.centerId;
                delete this.groupId;
                if (officeId) {
                    this.showMsg = false;
                    resourceFactory.employeeResource.getAllEmployees({officeId: officeId}, function (data) {
                        scope.loanOfficers = data;
                    });

                    resourceFactory.centerResource.getAllCenters({officeId: this.officeId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.centers = data;
                    });

                    resourceFactory.groupResource.getAllGroups({officeId: this.officeId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.groups = data;
                    });
                }
            };
            scope.centerSelected = function (centerId) {
                delete this.groupId;
                if (centerId) {
                    resourceFactory.centerResource.get({'centerId': centerId, associations: 'groupMembers' }, function (data) {
                        scope.centerdetails = data;
                        if (data.groupMembers.length > 0) {
                            scope.groups = data.groupMembers;
                        }
                    });
                }else{
                    resourceFactory.groupResource.getAllGroups({officeId: this.officeId, orderBy: 'name', sortOrder: 'ASC', limit: -1}, function (data) {
                        scope.groups = data;
                    });
                }

            };

            scope.resetsearchparams = function(){
                route.reload();
            }

            scope.clientSearch = function(){
                scope.clients = [];
                scope.loans = [];
                scope.checkData = [];
                scope.loanTemplate = {};
                scope.loanDisbursalTemplate = {};
                scope.approveData = {};
                scope.formData = {};
                if(this.officeId) {
                    this.showMsg = false;
                var staffId = this.loanOfficerId;
                if (this.centerId || this.groupId) {
                    staffId = undefined;
                }
                resourceFactory.clientLookupResource.get({sqlSearch: 'c.status_enum=100',officeId: this.officeId, staffId: staffId,groupId:this.groupId,centerId:this.centerId}, function (data) {
                    scope.clientData = data;
                });
                }else{
                    this.showMsg = true;
                }
            };
            scope.loanApproveSearch = function(){
                scope.clients = [];
                scope.loans = [];
                scope.checkData = [];
                scope.loanTemplate = {};
                scope.loanDisbursalTemplate = {};
                scope.approveData = {};
                scope.formData = {};
                if(this.officeId) {
                    this.showMsg = false;
                    var staffId = this.loanOfficerId;
                    if (this.centerId || this.groupId) {
                        staffId = undefined;
                    }
                    resourceFactory.tasklookupResource.get({
                        sqlSearch: 'ml.loan_status_id=100',
                        officeId: this.officeId,
                        staffId: staffId,
                        groupId: this.groupId,
                        centerId: this.centerId
                    }, function (data) {
                        scope.loanApproveData = data;
                    });
                }else{
                    this.showMsg = true;
                }
            };
            scope.loanDisburseSearch = function(){
                scope.clients = [];
                scope.loans = [];
                scope.checkData = [];
                scope.loanTemplate = {};
                scope.loanDisbursalTemplate = {};
                scope.approveData = {};
                scope.formData = {};
                if(this.officeId) {
                    this.showMsg = false;
                    var staffId = this.loanOfficerId;
                    if (this.centerId || this.groupId) {
                        staffId = undefined;
                    }
                    resourceFactory.tasklookupResource.get({
                        sqlSearch: 'ml.loan_status_id=200',
                        officeId: this.officeId,
                        staffId: staffId,
                        groupId: this.groupId,
                        centerId: this.centerId
                    }, function (data) {
                        scope.loanDisburseData = data;
                    });
                }else{
                    this.showMsg = true;
                }
            };
            scope.clientApprovalAllCheckBoxesClicked = function() {
                var newValue = !scope.clientApprovalAllCheckBoxesMet();
                if(!angular.isUndefined(scope.clientData)) {
                    for (var i = scope.clientData.length - 1; i >= 0; i--) {
                        scope.approveData[scope.clientData[i].id] = newValue;
                    };
                }
            }
            scope.clientApprovalAllCheckBoxesMet = function() {
                var checkBoxesMet = 0;
                if(!angular.isUndefined(scope.clientData)) {
                    _.each(scope.clientData, function(data) {
                        if(_.has(scope.approveData, data.id)) {
                            if(scope.approveData[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet===scope.clientData.length);
                }
            }
            scope.loanApprovalAllCheckBoxesClicked = function() {
                var newValue = !scope.loanApprovalAllCheckBoxesMet();
                if(!angular.isUndefined(scope.loanApproveData)) {
                    for (var i = scope.loanApproveData.length - 1; i >= 0; i--) {
                        scope.loanTemplate[scope.loanApproveData[i].id] = newValue;
                    };
                }
            }
            scope.loanApprovalAllCheckBoxesMet = function() {
                var checkBoxesMet = 0;
                if(!angular.isUndefined(scope.loanApproveData)) {
                    _.each(scope.loanApproveData, function(data) {
                        if(_.has(scope.loanTemplate, data.id)) {
                            if(scope.loanTemplate[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet===scope.loanApproveData.length);
                }
            }
            scope.loanDisbursalAllCheckBoxesClicked = function() {
                var newValue = !scope.loanDisbursalAllCheckBoxesMet();
                if(!angular.isUndefined(scope.loanDisburseData)) {
                    for (var i = scope.loanDisburseData.length - 1; i >= 0; i--) {
                        scope.loanDisbursalTemplate[scope.loanDisburseData[i].id] = newValue;
                    };
                }
            }
            scope.loanDisbursalAllCheckBoxesMet = function() {
                var checkBoxesMet = 0;
                if(!angular.isUndefined(scope.loanDisburseData)) {
                    _.each(scope.loanDisburseData, function(data) {
                        if(_.has(scope.loanDisbursalTemplate, data.id)) {
                            if(scope.loanDisbursalTemplate[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet===scope.loanDisburseData.length);
                }
            }

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
           //scope.approveLoanReschedule = function(){
           //}
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
                $scope.clientApproval = function (act) {
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
                    scope.requestIdentifier = "clientId";

                    var reqId = 1;
                    _.each(items, function (value, key) {                         
                        if (value == true) {
                            scope.batchRequests.push({requestId: reqId++, relativeUrl: "clients/"+key+"?command=activate", 
                            method: "POST", body: JSON.stringify(activate)});                        
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

                    scope.approveData = {};
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
                        controller: ApproveLoanCtrl,
                        resolve: {
                            items: function () {
                                return scope.loanTemplate;
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
            var ApproveLoanCtrl = function ($scope, $modalInstance,items) {
                $scope.restrictDate = new Date();
                $scope.date = {};
                $scope.date.actDate = new Date();
                $scope.loanApproval = function (act) {
                    var approve = {}
                    approve.approvedOnDate = dateFilter(act, scope.df);
                    approve.dateFormat = scope.df;
                    approve.locale = scope.optlang.code;
                    var totalLoans = 0;
                    var loanCount = 0
                    _.each(items, function (value, key) {
                        if (value == true) {
                            totalLoans++;
                        }
                    });

                    scope.batchRequests = [];
                    scope.requestIdentifier = "loanId";

                    var reqId = 1;
                    _.each(items, function (value, key) {
                        if (value == true) {
                            scope.batchRequests.push({requestId: reqId++, relativeUrl: "loans/"+key+"?command=approve",
                                method: "POST", body: JSON.stringify(approve)});
                        }
                    });
                    resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                        for(var i = 0; i < data.length; i++) {
                            if(data[i].statusCode = '100') {
                                loanCount++;
                                if (loanCount == totalLoans) {
                                    route.reload();
                                }
                            }

                        }
                    });

                    scope.loanTemplate = {};
                    $modalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.disburseLoan = function () {
                if (scope.loanDisbursalTemplate) {
                    $modal.open({
                        templateUrl: 'disburseloan.html',
                        controller: DisburseLoanCtrl,
                        resolve: {
                            items: function () {
                                return scope.loanDisbursalTemplate;
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

            var DisburseLoanCtrl = function ($scope, $modalInstance, items) {
                $scope.restrictDate = new Date();
                $scope.date = {};
                $scope.date.actDate = new Date();
                $scope.loandisburse = function (act) {
                    var disburse = {}
                    disburse.actualDisbursementDate = dateFilter(act, scope.df);
                    disburse.dateFormat = scope.df;
                    disburse.locale = scope.optlang.code;
                    var totalDisbursalLoans = 0;
                    var DisbursalloanCount = 0;
                    _.each(items, function (value, key) {
                        if (value == true) {
                            totalDisbursalLoans++;
                        }
                    });

                    scope.batchRequests = [];
                    scope.requestIdentifier = "loanId";

                    var reqId = 1;
                    _.each(items, function (value, key) {
                        if (value == true) {
                            scope.batchRequests.push({requestId: reqId++, relativeUrl: "loans/"+key+"?command=disburse",
                                method: "POST", body: JSON.stringify(disburse)});
                        }
                    });
                    resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                        for(var i = 0; i < data.length; i++) {
                            if(data[i].statusCode = '200') {
                                DisbursalloanCount++;
                                if (DisbursalloanCount == totalDisbursalLoans) {
                                    route.reload();
                                }
                            }

                        }
                    });

                    scope.loanDisbursalTemplate = {};
                    $modalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.routeTo = function (id) {
                location.path('viewcheckerinbox/' + id);
            };

            scope.routeToLoan = function (id) {
                location.path('viewloanaccount/' + id);
            };
        }
    });
    mifosX.ng.application.controller('TaskController', ['$scope', 'ResourceFactory', '$route', 'dateFilter', '$modal', '$location', mifosX.controllers.TaskController]).run(function ($log) {
        $log.info("TaskController initialized");
    });
}(mifosX.controllers || {}));
