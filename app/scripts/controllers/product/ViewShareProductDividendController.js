(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewShareProductDividendController: function (scope, routeParams, paginatorService, resourceFactory, location) {
            scope.dividendTransactions = [];
            scope.isdividendPosted = false ;
            if(routeParams.status && (routeParams.status== 'Dividend Approved' || routeParams.status== 'Dividend Posted')) {
                scope.isdividendPosted = true ;
            }
            resourceFactory.shareProduct.get({shareProductId: routeParams.productId}, function (data) {
                scope.shareproduct = data;
            });

            scope.postDividends = function () {
                resourceFactory.shareproductdividendresource.approve({productId: routeParams.productId, dividendId: routeParams.dividendId}, function (data) {
                    location.path('/dividends/' + routeParams.productId);
                });
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
                resourceFactory.shareproductdividendresource.getAll(params, {productId: routeParams.productId, dividendId: routeParams.dividendId}, callback) ;
            };

            paginatorService.currentOffset = 0 ;
            scope.dividendTransactions = paginatorService.paginate(fetchFunction, 10);
        }
    });
    mifosX.ng.application.controller('ViewShareProductDividendController', ['$scope', '$routeParams', 'PaginatorService', 'ResourceFactory', '$location', mifosX.controllers.ViewShareProductDividendController]).run(function ($log) {
        $log.info("ViewShareProductDividendController initialized");
    });
}(mifosX.controllers || {}));