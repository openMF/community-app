(function(module) {
  mifosX.controllers = _.extend(module, {
    SearchTransactionController: function(scope, resourceFactory , paginatorService,dateFilter) {

        scope.filters = [{option: "All", value: ""},{option: "Manual Entries", value: true},{option: "System Entries", value: false}];
        scope.isCollapsed = true;
        scope.displayResults = false;
        scope.transactions = [];
        scope.glAccounts = [];
        scope.offices = [];
        scope.date={};
        scope.formData={};

        resourceFactory.accountCoaResource.getAllAccountCoas({manualEntriesAllowed:true, usage:1, disabled:false}, function(data){
          scope.glAccounts = data;
        });

        resourceFactory.officeResource.getAllOffices(function(data){
          scope.offices = data;  
        });

       var fetchFunction = function(offset, limit, callback) {
          var reqFirstDate = dateFilter(scope.date.first,'dd MMMM yyyy');
          var reqSecondDate = dateFilter(scope.date.second,'dd MMMM yyyy');
          var params = {};
          params.offset = offset;
          params.limit = limit;
          params.locale = "en";
          params.dateFormat = "dd MMMM yyyy";

          if (scope.formData.transactionId) { params.transactionId = scope.formData.transactionId; };

          if (scope.formData.glAccount) { params.glAccountId = scope.formData.glAccount.id; };

          if (scope.formData.officeId) { params.officeId = scope.formData.officeId; };

          if (scope.formData.manualEntriesOnly) { params.manualEntriesOnly = scope.formData.manualEntriesOnly; };

          if (scope.date.first) { params.fromDate = reqFirstDate; };

          if (scope.date.second) { params.toDate = reqSecondDate; };

          resourceFactory.journalEntriesResource.search(params, callback);
        };

        scope.searchTransaction = function () {
          scope.displayResults = true;
          scope.transactions = paginatorService.paginate(fetchFunction, 14);
          scope.isCollapsed= true;
        };

    }
  });
  mifosX.ng.application.controller('SearchTransactionController', ['$scope', 'ResourceFactory', 'PaginatorService','dateFilter', mifosX.controllers.SearchTransactionController]).run(function($log) {
    $log.info("SearchTransactionController initialized");
  });
}(mifosX.controllers || {}));