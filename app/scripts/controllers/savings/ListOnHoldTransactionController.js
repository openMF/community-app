(function (module) {
    mifosX.controllers = _.extend(module, {
        ListOnHoldTransactionController: function (scope, resourceFactory, paginatorService, routeParams, dateFilter) {

            scope.fromPath = routeParams.fromPath;
            scope.fromPathId = routeParams.fromPathId;
            scope.transactions = [];

            var fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = scope.optlang.code;
                params.dateFormat = scope.df;
                params.guarantorFundingId = routeParams.fundingId;
                params.savingsId = routeParams.savingsId;

                resourceFactory.savingsOnHoldTrxnsResource.get(params, callback);
            };

            scope.transactions = paginatorService.paginate(fetchFunction, 14);
        }
    });
    mifosX.ng.application.controller('ListOnHoldTransactionController', ['$scope', 'ResourceFactory', 'PaginatorService', '$routeParams', 'dateFilter', mifosX.controllers.ListOnHoldTransactionController]).run(function ($log) {
        $log.info("ListOnHoldTransactionController initialized");
    });
}(mifosX.controllers || {}));
