(function (module) {
    mifosX.controllers = _.extend(module, {
        RiskCriteriaController: function (scope, routeParams, resourceFactory, location, $modal, route, $http) {

            scope.riskCriterias = [];
            scope.riskCriteriaId = routeParams.id;
            scope.desccription = "";
            scope.name = "";

            resourceFactory.riskCriteria.getAll(function (data) {
                scope.riskCriterias = data;
            });

            scope.routeTo = function (id) {
                location.path('/risk/criteria/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/risk/editcriteria/' + id);
            };
        }
    });
    mifosX.ng.application.controller('RiskCriteriaController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', '$http', mifosX.controllers.RiskCriteriaController]).run(function ($log) {
        $log.info("RiskCriteriaController initialized");
    });

}(mifosX.controllers || {}));