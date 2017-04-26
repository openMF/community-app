(function (module) {
    mifosX.controllers = _.extend(module, {
        ShareProductDividendController: function (scope, routeParams, paginatorService, resourceFactory, location) {
            scope.dividendTransactions = [];

            resourceFactory.shareProduct.get({shareProductId: routeParams.productId}, function (data) {
                scope.shareproduct = data;
            });

            scope.routeTo = function (id, status) {
                location.path('/dividends/' + routeParams.productId+'/dividend/'+id+"/"+status);
                scope.saveSC();
            };

            if (!scope.searchCriteria.savingP) {
                scope.searchCriteria.savingP = null;
            }
            scope.filterText = scope.searchCriteria.savingP || '';

            scope.onFilter = function () {
                scope.searchCriteria.savingP = scope.filterText;
                scope.saveSC();
            };

            var fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = scope.optlang.code;
                params.dateFormat = scope.df;
                scope.saveSC();
                resourceFactory.shareproductdividendresource.getAll(params, {productId: routeParams.productId}, callback) ;
            };

            paginatorService.currentOffset = 0 ;
            scope.dividendTransactions = paginatorService.paginate(fetchFunction, 10);
        }
    });
    mifosX.ng.application.controller('ShareProductDividendController', ['$scope', '$routeParams', 'PaginatorService', 'ResourceFactory', '$location', mifosX.controllers.ShareProductDividendController]).run(function ($log) {
        $log.info("ShareProductDividendController initialized");
    });
}(mifosX.controllers || {}));