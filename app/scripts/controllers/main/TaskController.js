(function(module) {
  mifosX.controllers = _.extend(module, {
    TaskController: function(scope, resourceFactory, route, dateFilter,$modal,location) {
        scope.clients = [];
        scope.loans = [];
        scope.offices = [];
        var idToNodeMap = {};
        scope.formData = {};
        scope.loanTemplate = {};
        scope.date = {};
        scope.checkData = [];
        scope.isCollapsed = true;
        scope.approveData = {};
        scope.restrictDate = new Date();

        resourceFactory.checkerInboxResource.get({templateResource:'searchtemplate'},function(data){
            scope.checkerTemplate = data;
        });
        resourceFactory.checkerInboxResource.search(function(data) {
            scope.searchData = data;
        });
        scope.viewUser = function(item){
            scope.userTypeahead = true;
            scope.formData.user = item.id;
        };
        scope.approveChecker = function () {
            if(scope.checkData){
                $modal.open({
                    templateUrl: 'approvechecker.html',
                    controller: CheckerApproveCtrl
                });
            }
        };
        var CheckerApproveCtrl = function ($scope, $modalInstance) {

            $scope.approve = function () {
                var totalApprove = 0;
                var approveCount = 0;
                _.each(scope.checkData,function(value,key)
                {
                    if(value==true)
                    {
                      totalApprove++;
                    }
                });
                _.each(scope.checkData,function(value,key)
                {
                    if(value==true)
                    {

                        resourceFactory.checkerInboxResource.save({templateResource: key,command:'approve'},{}, function(data){
                          approveCount++;
                          if(approveCount==totalApprove){
                              scope.search();
                          }
                        },function(data){
                          approveCount++;
                          if(approveCount==totalApprove){
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
            if(scope.checkData){
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
                _.each(scope.checkData,function(value,key)
                {
                    if(value==true)
                    {
                        totalDelete++;
                    }
                });
                _.each(scope.checkData,function(value,key)
                {
                    if(value==true)
                    {

                        resourceFactory.checkerInboxResource.delete({templateResource: key}, {}, function(data){
                            deleteCount++;
                            if(deleteCount==totalDelete){
                                scope.search();
                            }
                        }, function(data){
                            deleteCount++;
                            if(deleteCount==totalDelete){
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
            if(scope.approveData){
                $modal.open({
                    templateUrl: 'approveclient.html',
                    controller: ApproveClientCtrl,
                    resolve:{
                        items: function () {
                            return scope.approveData;
                        }
                    }
                });
            }
        };

        $(window).scroll(function() {
            if( $(this).scrollTop() > 100 ) {
                $('.head-affix').css({
                    "position": "fixed",
                    "top":"50px"
                });

            } else {
                $('.head-affix').css({
                    position: 'static'
                });
            }
        });

        var ApproveClientCtrl = function ($scope, $modalInstance,items) {
            $scope.restrictDate = new Date();
            $scope.date = {};
            $scope.date.actDate = new Date();
            $scope.approve = function (act) {
                var activate = {}
                activate.activationDate = dateFilter(act,scope.df);
                activate.dateFormat = scope.df;
                activate.locale = scope.optlang.code;
                var totalClient = 0;
                var clientCount = 0
                _.each(items,function(value,key)
                {
                    if(value==true)
                    {
                        totalClient++;
                    }
                });
                _.each(items,function(value,key)
                {
                    if(value==true)
                    {

                        resourceFactory.clientResource.save({clientId: key, command : 'activate'}, activate,function(data){
                            clientCount++;
                            if(clientCount==totalClient){
                                route.reload();
                            }
                        }, function(data){
                            clientCount++;
                            if(clientCount==totalClient){
                                route.reload();
                            }
                        });
                    }
                });
                scope.approveData = {};
                $modalInstance.close('delete');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        scope.routeTo = function(id){
          location.path('viewcheckerinbox/'+id);
        };

        scope.routeToClient = function(id){
            location.path('viewclient/'+id);
        };

        resourceFactory.officeResource.getAllOffices(function(data){
          scope.offices = data;
          for(var i in data){
            data[i].loans = [];
            idToNodeMap[data[i].id] = data[i];
          }
           scope.loanResource = function(){
              resourceFactory.loanResource.getAllLoans(function(loanData) {
                scope.loans = loanData.pageItems;
                for(var i in scope.loans) {
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

                var finalArray = [];
                for(var i in scope.offices){
                  if (scope.offices[i].loans.length > 0) {
                    finalArray.push(scope.offices[i]);
                  }
                }
                scope.offices = finalArray;
              });
           };
           scope.loanResource();
        });


        resourceFactory.clientResource.getAllClients(function(data) {
            scope.groupedClients = _.groupBy(data.pageItems, "officeName");
        });

        scope.search = function(){
            scope.isCollapsed = true;
            var reqFromDate = dateFilter(scope.date.from,'yyyy-MM-dd');
            var reqToDate = dateFilter(scope.date.to,'yyyy-MM-dd');
            var params = {};
            if (scope.formData.action) { params.actionName = scope.formData.action; };

            if (scope.formData.entity) { params.entityName = scope.formData.entity; };

            if (scope.formData.resourceId) { params.resourceId = scope.formData.resourceId; };

            if (scope.formData.user) { params.makerId = scope.formData.user; };

            if (scope.date.from) { params.makerDateTimeFrom = reqFromDate; };

            if (scope.date.to) { params.makerDateTimeto = reqToDate; };
            resourceFactory.checkerInboxResource.search(params , function(data) {
                scope.searchData = data;
                if(scope.userTypeahead){
                    scope.formData.user = '';
                    scope.userTypeahead = false;
                    scope.user = '';
                }
            });
        };

        scope.approveLoan = function () {
            if(scope.loanTemplate){
                $modal.open({
                    templateUrl: 'approveloan.html',
                    controller: ApproveLoanCtrl
                });
            }
        };

        var ApproveLoanCtrl = function ($scope, $modalInstance) {
            $scope.approve = function(){
              scope.bulkApproval();
                route.reload();
                $modalInstance.close('approve');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }

        scope.bulkApproval = function (){
              scope.formData.approvedOnDate = dateFilter(new Date(),scope.df);
              scope.formData.dateFormat = "dd MMMM yyyy";
              scope.formData.locale = "en";
              var selectedAccounts = 0;
              var approvedAccounts = 0;
              _.each(scope.loanTemplate,function(value,key){
                  if(value==true) {
                    selectedAccounts++;
                  }
              });
              _.each(scope.loanTemplate,function(value,key){
                  if(value==true) {
                    resourceFactory.LoanAccountResource.save({command:'approve', loanId:key}, scope.formData, function(data){
                      approvedAccounts++;
                      scope.loanTemplate[key] = false;
                      if (selectedAccounts == approvedAccounts) {
                        scope.loanResource();
                      }
                    }, function(data){
                        approvedAccounts++;
                        scope.loanTemplate[key] = false;
                        if (selectedAccounts == approvedAccounts) {
                            scope.loanResource();
                        }
                  });
                  }
              });
        };

    }
  });
  mifosX.ng.application.controller('TaskController', ['$scope', 'ResourceFactory', '$route', 'dateFilter','$modal','$location', mifosX.controllers.TaskController]).run(function($log) {
    $log.info("TaskController initialized");
  });
}(mifosX.controllers || {}));
