(function(module) {
  mifosX.controllers = _.extend(module, {
    SearchTransactionController: function(scope, resourceFactory , paginatorService) {

        scope.filters = [{option: "All", value: ""},{option: "Manual Entries", value: true},{option: "System Entries", value: false}];
        scope.isCollapsed = true;
        scope.displayResults = false;

        scope.transactions = [];
        scope.glAccounts = [];
        scope.offices = [];

        resourceFactory.accountCoaResource.getAllAccountCoas({manualEntriesAllowed:true, usage:1, disabled:false}, function(data){
          scope.glAccounts = data;
        });

        resourceFactory.officeResource.getAllOffices(function(data){
          scope.offices = data;  
        });

       var fetchFunction = function(offset, limit, transactionId, callback) {
          resourceFactory.journalEntriesResource.search({offset: offset, limit: limit, transactionId : transactionId} , callback);
        };


        scope.searchByTransaction = function (transactionId) {
          if (transactionId != undefined && transactionId != "") {
            scope.displayResults = true;
            scope.transactions = paginatorService.paginate(fetchFunction, 4);
          }
        };

        scope.searchTransaction = function (data) {
          if (data != undefined) {
            data.glAccountId = data.glAccount.id;
            delete data.glAccount;
            scope.displayResults = true;
            scope.transactions = paginatorService.paginate(fetchFunction, 4);
          }
          scope.isCollapsed= true;
        }

    }
  });
  mifosX.ng.application.controller('SearchTransactionController', ['$scope', 'ResourceFactory', 'PaginatorService', mifosX.controllers.SearchTransactionController]).run(function($log) {
    $log.info("SearchTransactionController initialized");
  });
}(mifosX.controllers || {}));