(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewTaxGroupController: function (scope, resourceFactory, routeParams) {

            resourceFactory.taxgroup.get({taxGroupId: routeParams.taxGroupId, template: 'false'},function (data) {
                scope.taxgroup = data;
            });

        }
    });
    mifosX.ng.application.controller('ViewTaxGroupController', ['$scope', 'ResourceFactory', '$routeParams',  mifosX.controllers.ViewTaxGroupController]).run(function ($log) {
        $log.info("ViewTaxGroupController initialized");
    });
}(mifosX.controllers || {}));
