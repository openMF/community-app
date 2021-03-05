(function (module) {
    mifosX.controllers = _.extend(module, {
        ChargeController: function (scope, resourceFactory, location) {
            scope.charges = [];

            scope.routeTo = function (id) {
                location.path('/viewcharge/' + id);
            };

            if (!scope.searchCriteria.charges) {
                scope.searchCriteria.charges = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.charges || '';

            scope.onFilter = function () {
                scope.searchCriteria.charges = scope.filterText;
                scope.saveSC();
            };

            scope.ChargesPerPage =15;
            scope.$broadcast('ChargeDataLoadingStartEvent');
            resourceFactory.chargeResource.getAllCharges(function (data) {
                scope.charges = data;
                scope.$broadcast('ChargeDataLoadingCompleteEvent');
            });
        }
    });
    mifosX.ng.application.controller('ChargeController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ChargeController]).run(function ($log) {
        $log.info("ChargeController initialized");
    });
}(mifosX.controllers || {}));