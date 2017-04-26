(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewTaxComponentController: function (scope, resourceFactory, routeParams) {

            resourceFactory.taxcomponent.get({taxComponentId: routeParams.taxComponentId, template: 'true'},function (data) {
                scope.taxComponent = data;
            });

        }
    });
    mifosX.ng.application.controller('ViewTaxComponentController', ['$scope', 'ResourceFactory', '$routeParams',  mifosX.controllers.ViewTaxComponentController]).run(function ($log) {
        $log.info("ViewTaxComponentController initialized");
    });
}(mifosX.controllers || {}));
