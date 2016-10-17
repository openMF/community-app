(function (module) {
    mifosX.controllers = _.extend(module, {
        RiskDimensionController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.riskDimensions = [];
            scope.riskDimensionId = routeParams.id;
            scope.desccription = "";
            scope.name = "";

            resourceFactory.riskDimension.getAll(function (data) {
                scope.riskDimensions = data;
            });

            scope.routeTo = function (id) {
                location.path('/risk/dimension/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/risk/editdimension/' + id);
            };
        }
    });
    mifosX.ng.application.controller('RiskDimensionController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.RiskDimensionController]).run(function ($log) {
        $log.info("RiskDimensionController initialized");
    });

}(mifosX.controllers || {}));