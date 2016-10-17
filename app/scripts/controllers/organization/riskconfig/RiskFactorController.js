(function (module) {
    mifosX.controllers = _.extend(module, {
        RiskFactorController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.riskFactors = [];
            scope.riskFactorId = routeParams.id;
            scope.desccription = "";
            scope.name = "";

            resourceFactory.riskFactor.getAll(function (data) {
                scope.riskFactors = data;
            });

            scope.routeTo = function (id) {
                location.path('/risk/factor/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/risk/editfactor/' + id);
            };
        }
    });
    mifosX.ng.application.controller('RiskFactorController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.RiskFactorController]).run(function ($log) {
        $log.info("RiskFactorController initialized");
    });

}(mifosX.controllers || {}));