(function (module) {
    mifosX.controllers = _.extend(module, {
        CollateralController: function (scope, resourceFactory, location) {

            scope.routeTo = function (id) {
                location.path('/viewcollateral/' + id);
            };

            scope.CollateralPerPage =15;
            resourceFactory.collateralResource.getAllCollaterals(function (data) {
                scope.collaterals = data;
            });
        }
    });
    mifosX.ng.application.controller('CollateralController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CollateralController]).run(function ($log) {
        $log.info("CollateralController initialized");
    });
}(mifosX.controllers || {}));