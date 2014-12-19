(function (module) {
    mifosX.controllers = _.extend(module, {
        CashierTransactionsController: function (scope, routeParams, route, location, resourceFactory) {

            scope.cashiertxns = [];
            var idToNodeMap = {};

            scope.routeTo = function (id) {
                location.path('/viewcashiertxns/' + id);
            };

            scope.routeToAllocate = function () {
                location.path('tellers/' + routeParams.tellerId + '/cashiers/' + routeParams.cashierId + '/actions/allocate');
            };

            scope.routeToSettle = function () {
                location.path('tellers/' + routeParams.tellerId + '/cashiers/' + routeParams.cashierId + '/actions/settle');
            };

            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }

            resourceFactory.tellerCashierSummaryAndTxnsResource.getCashierSummaryAndTransactions({tellerId: routeParams.tellerId, cashierId: routeParams.cashierId}, function (data) {
                scope.cashierSummaryAndTxns = data;
            });

        }
    });
    mifosX.ng.application.controller('CashierTransactionsController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.CashierTransactionsController]).run(function ($log) {
        $log.info("CashierTransactionsController initialized");
    });
}(mifosX.controllers || {}));
