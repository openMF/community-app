(function (module) {
    mifosX.controllers = _.extend(module, {
        CenterController: function (scope, resourceFactory, paginatorService, location, routeParams) {
            scope.centers = [];
            scope.searchResults = [];
            scope.routeTo = function (id) {
                location.path('/viewcenter/' + id);
            };

            scope.search = function () {
                location.path('/centers/' + scope.center.query);
            }

            if (routeParams.query == null) {

                if (!scope.searchCriteria.centers) {
                    scope.searchCriteria.centers = null;
                    scope.saveSC();
                }
                scope.filterText = scope.searchCriteria.centers;

                scope.onFilter = function () {
                    scope.searchCriteria.centers = scope.filterText;
                    scope.saveSC();
                };

                var fetchFunction = function (offset, limit, callback) {
                    resourceFactory.centerResource.get({
                        offset: offset,
                        limit: limit,
                        paged: 'true',
                        orderBy: 'name',
                        sortOrder: 'ASC'
                    }, callback);
                };

                scope.centers = paginatorService.paginate(fetchFunction, 14);
            }

            scope.query = routeParams.query;
            resourceFactory.globalSearch.search({query: routeParams.query}, function (data) {
                scope.searchResults = data;
            });

        }
    });
    mifosX.ng.application.controller('CenterController', ['$scope', 'ResourceFactory', 'PaginatorService', '$location', '$routeParams', mifosX.controllers.CenterController]).run(function ($log) {
        $log.info("CenterController initialized");
    });
}(mifosX.controllers || {}));