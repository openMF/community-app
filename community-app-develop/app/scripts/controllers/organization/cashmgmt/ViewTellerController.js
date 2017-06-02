(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewTellerController: function (scope, routeParams, route, location, resourceFactory) {
            resourceFactory.tellerResource.get({tellerId: routeParams.id}, function (data) {
                scope.teller = data;
            })
        }

    });
    mifosX.ng.application.controller('ViewTellerController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewTellerController]).run(function ($log) {
        $log.info("ViewTellerController initialized");
    });
}(mifosX.controllers || {}));