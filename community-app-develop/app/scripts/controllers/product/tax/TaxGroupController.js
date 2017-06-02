(function (module) {
    mifosX.controllers = _.extend(module, {
        TaxGroupController: function (scope, resourceFactory, location) {
            scope.taxgroups = [];

            scope.routeTo = function (id) {
                location.path('/viewtaxgroup/' + id);
            };


            resourceFactory.taxgroup.getAll(function (data) {
                scope.taxgroups = data;
            });
        }
    });
    mifosX.ng.application.controller('TaxGroupController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.TaxGroupController]).run(function ($log) {
        $log.info("TaxGroupController initialized");
    });
}(mifosX.controllers || {}));