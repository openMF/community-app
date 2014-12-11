(function (module) {
    mifosX.controllers = _.extend(module, {
        SearchTransactionController: function (scope, resourceFactory, paginatorService, dateFilter, location) {
            scope.filters = [
                {option: "All", value: ""},
                {option: "Manual Entries", value: true},
                {option: "System Entries", value: false}
            ];
            scope.isCollapsed = true;
            scope.displayResults = false;
            scope.transactions = [];
            scope.glAccounts = [];
            scope.offices = [];
            scope.date = {};
            scope.formData = {};
            scope.routeTo = function (id) {
                location.path('/viewtransactions/' + id);
            };
            resourceFactory.accountCoaResource.getAllAccountCoas({
                manualEntriesAllowed: true,
                usage: 1,
                disabled: false
            }, function (data) {
                scope.glAccounts = data;
            });

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            if (!scope.searchCriteria.journals) {
                scope.searchCriteria.journals = [null, null, null, null, null, null];
                scope.saveSC();
            }
            scope.formData.transactionId = scope.searchCriteria.journals[0];
            scope.formData.glAccount = scope.searchCriteria.journals[1];
            scope.formData.officeId = scope.searchCriteria.journals[2];
            scope.formData.manualEntriesOnly = scope.searchCriteria.journals[3];
            scope.date.first = scope.searchCriteria.journals[4];
            scope.date.second = scope.searchCriteria.journals[5];

            var fetchFunction = function (offset, limit, callback) {
                var reqFirstDate = dateFilter(scope.date.first, scope.df);
                var reqSecondDate = dateFilter(scope.date.second, scope.df);
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = "en";
                params.dateFormat = scope.df;

                if (scope.formData.transactionId) {
                    params.transactionId = scope.formData.transactionId;
                    scope.searchCriteria.journals[0] = params.transactionId;
                } else
                    scope.searchCriteria.journals[0] = null;

                if (scope.formData.glAccount) {
                    params.glAccountId = scope.formData.glAccount;
                    scope.searchCriteria.journals[1] = params.glAccountId;
                } else
                    scope.searchCriteria.journals[1] = null;

                if (scope.formData.officeId) {
                    params.officeId = scope.formData.officeId;
                    scope.searchCriteria.journals[2] = params.officeId;
                } else
                    scope.searchCriteria.journals[2] = null;

                if (scope.formData.manualEntriesOnly == true || scope.formData.manualEntriesOnly == false) {
                    params.manualEntriesOnly = scope.formData.manualEntriesOnly;
                    scope.searchCriteria.journals[3] = params.manualEntriesOnly;
                } else
                    scope.searchCriteria.journals[3] = null;

                if (scope.date.first) {
                    params.fromDate = reqFirstDate;
                    scope.searchCriteria.journals[4] = params.fromDate;
                } else
                    scope.searchCriteria.journals[4] = null;

                if (scope.date.second) {
                    params.toDate = reqSecondDate;
                    scope.searchCriteria.journals[5] = params.toDate;
                } else
                    scope.searchCriteria.journals[5] = null;

                scope.saveSC();
                resourceFactory.journalEntriesResource.search(params, callback);
            };

            scope.searchTransaction = function () {
                scope.displayResults = true;
                scope.transactions = paginatorService.paginate(fetchFunction, 14);
                scope.isCollapsed = false;
            };

        }
    });
    mifosX.ng.application.controller('SearchTransactionController', ['$scope', 'ResourceFactory', 'PaginatorService', 'dateFilter', '$location', mifosX.controllers.SearchTransactionController]).run(function ($log) {
        $log.info("SearchTransactionController initialized");
    });
}(mifosX.controllers || {}));