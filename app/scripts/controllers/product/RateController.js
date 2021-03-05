/**
 * Created by Jose on 24/07/2017.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        RateController: function (scope, resourceFactory, location) {
            scope.rates = [];

            scope.routeTo = function (id) {
                location.path('/viewrate/' + id);
            };

            if (!scope.searchCriteria.rates) {
                scope.searchCriteria.rates = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.rates || '';

            scope.onFilter = function () {
                scope.searchCriteria.rates = scope.filterText;
                scope.saveSC();
            };

            scope.RatesPerPage = 15;
            resourceFactory.rateResource.getAllRates(function (data) {
                scope.rates = data;
            });
        }
    });
    mifosX.ng.application.controller('RateController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.RateController]).run(function ($log) {
        $log.info("RateController initialized");
    });
}(mifosX.controllers || {}));