(function (module) {
    mifosX.controllers = _.extend(module, {
        TaxComponentController: function (scope, resourceFactory, location) {
            scope.taxcomponents = [];

            scope.routeTo = function (id) {
                location.path('/viewtaxcomponent/' + id);
            };


            resourceFactory.taxcomponent.getAll(function (data) {
                scope.taxcomponents = data;
            });
        }
    });
    mifosX.ng.application.controller('TaxComponentController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.TaxComponentController]).run(function ($log) {
        $log.info("TaxComponentController initialized");
    });
}(mifosX.controllers || {}));