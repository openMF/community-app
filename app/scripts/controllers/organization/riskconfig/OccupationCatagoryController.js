(function (module) {
    mifosX.controllers = _.extend(module, {
        OccupationCatagoryController: function (scope, routeParams, resourceFactory, location, $modal, route) {

            resourceFactory.cashFlowCategoryResource.getAll(function (response) {
                scope.cashFlowCategories = response;
            });

            scope.routeTo = function (id) {
                location.path('/viewoccupationcategory/' + id);
            };

            scope.routeToOccupation = function (id) {
                location.path('/occupation/' + id);
            };

            scope.showEdit = function (id) {
                location.path('/occcategory/editoccupationcategory/' + id);
            }
        }
    });
    mifosX.ng.application.controller('OccupationCatagoryController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.OccupationCatagoryController]).run(function ($log) {
        $log.info("OccupationCatagoryController initialized");
    });

}(mifosX.controllers || {}));