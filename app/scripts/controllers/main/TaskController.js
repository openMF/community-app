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
        resourceFactory.checkerInboxResource.get({templateResource:'searchtemplate'},function(data){
            scope.checkerTemplate = data;
        });
        resourceFactory.checkerInboxResource.search(function(data) {
            scope.searchData = data;
        });
        scope.approveChecker = function () {
            $modal.open({
                templateUrl: 'approvechecker.html',
                controller: CheckerApproveCtrl
           });
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
            $modal.open({
                templateUrl: 'deletechecker.html',
                controller: CheckerDeleteCtrl
            });
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

        scope.routeTo = function(id){
          location.path('viewcheckerinbox/'+id);
        };

        resourceFactory.officeResource.getAllOffices(function(data){
          scope.offices = data;
          for(var i in data){
            data[i].loans = [];
            idToNodeMap[data[i].id] = data[i];
          }

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
        });

        resourceFactory.clientResource.getAllClients(function(data) {
          scope.clients = data.pageItems;
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
            });
        };

        scope.bulkApproval = function (){
              scope.formData.approvedOnDate = dateFilter(new Date(),'dd MMMM yyyy');
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
                        route.reload();
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
