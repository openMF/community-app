(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCashiersForTellerController: function (scope, routeParams, route, location, resourceFactory) {

            var requestParams = {};

            if (routeParams.tellerId) {
                requestParams.tellerId = routeParams.tellerId;
            }

            resourceFactory.tellerCashierResource.getAllCashiersForTeller({tellerId: routeParams.tellerId}, function (data) {
                scope.cashiersForTeller = data;
            });

            resourceFactory.currencyConfigResource.get({fields: 'selectedCurrencyOptions'}, function (data) {
                scope.currencyCode = data.selectedCurrencyOptions[0].code;
            });

            var idToNodeMap = {};
            scope.routeTo = function (tellerId, cashierId) {
                location.path('/tellers/' + tellerId + '/cashiers/' + cashierId);
            };

            scope.delete = function (tellerId, cashierId) {
                resourceFactory.tellerCashierResource.delete({tellerId: tellerId, cashierId: cashierId}, function (data) {
                    location.path('/tellers/' + tellerId + '/cashiers/');
                });
            };

            scope.routeToView = function (tellerId, cashierId) {
                    location.path('/tellers/' + tellerId + "/cashiers/" + cashierId);
            };

            scope.allocate = function (tellerId, cashierId) {
                location.path('/tellers/' + tellerId + "/cashiers/" + cashierId + "/actions/allocate/");
            };
            scope.settle = function (tellerId, cashierId) {
                location.path('/tellers/' + tellerId + "/cashiers/" + cashierId + "/actions/settle/");
            };
            scope.transactions = function (tellerId, cashierId) {
                location.path('/tellers/' + tellerId + "/cashiers/" + cashierId + "/txns/" + scope.currencyCode );
            };

            scope.compare = function (x, y) {
                    var objectsAreSame = true;
                    for(var propertyName in x) {
                    if(x[propertyName] !== y[propertyName]) {
                        objectsAreSame = false;
                        break;
                    }
                }
                return objectsAreSame;
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
        }
    });
    mifosX.ng.application.controller('ViewCashiersForTellerController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewCashiersForTellerController]).run(function ($log) {
        $log.info("ViewCashiersForTellerController initialized");
    });
} (mifosX.controllers || {}));