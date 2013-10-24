(function(module) {
  mifosX.controllers = _.extend(module, {
    TaskController: function(scope, resourceFactory, route, dateFilter) {
        
        scope.clients = [];
        scope.loans = [];
        scope.offices = [];
        var idToNodeMap = {};
        scope.formData = {};
        scope.loanTemplate = {};

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
  mifosX.ng.application.controller('TaskController', ['$scope', 'ResourceFactory', '$route', 'dateFilter', mifosX.controllers.TaskController]).run(function($log) {
    $log.info("TaskController initialized");
  });
}(mifosX.controllers || {}));
