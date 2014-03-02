(function (module) {
    mifosX.controllers = _.extend(module, {
        CurrencyConfigController: function (scope, resourceFactory, route) {

            scope.selectedCurrOptions = [];
            scope.allCurrOptions = [];
            scope.hideview = false;
            scope.selected = undefined;

            resourceFactory.currencyConfigResource.get(function (data) {
                scope.selectedCurrOptions = data.selectedCurrencyOptions;
                scope.allCurrOptions = data.currencyOptions;

            });

            scope.deleteCur = function (code) {
                for (var i = 0; i < scope.selectedCurrOptions.length; i++) {
                    if (scope.selectedCurrOptions[i].code == code) {
                        scope.selectedCurrOptions.splice(i, 1);  //removes 1 element at position i
                        break;
                    }
                }
            };

            scope.addCur = function () {
                if (scope.selected != undefined && scope.selected.hasOwnProperty('code')) {
                    scope.selectedCurrOptions.push(scope.selected);
                    for (var i = 0; i < scope.allCurrOptions.length; i++) {
                        if (scope.allCurrOptions[i].code == scope.selected.code) {
                            scope.allCurrOptions.splice(i, 1);  //removes 1 element at position i
                            break;
                        }
                    }
                }
                scope.selected = undefined;
            };

            scope.submit = function () {
                var currencies = [];
                var curr = {};
                for (var i = 0; i < scope.selectedCurrOptions.length; i++) {
                    currencies.push(scope.selectedCurrOptions[i].code);
                }
                curr["currencies"] = currencies;
                resourceFactory.currencyConfigResource.upd(curr, function (data) {
                    route.reload();
                });

            };

            scope.cancel = function () {
                route.reload();
            }

        }
    });
    mifosX.ng.application.controller('CurrencyConfigController', ['$scope', 'ResourceFactory', '$route', mifosX.controllers.CurrencyConfigController]).run(function ($log) {
        $log.info("CurrencyConfigController initialized");
    });
}(mifosX.controllers || {}));
