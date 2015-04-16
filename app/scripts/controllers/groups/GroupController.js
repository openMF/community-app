(function (module) {
    mifosX.controllers = _.extend(module, {
        GroupController: function (scope, resourceFactory, paginatorService, location, routeParams) {
            scope.groups = [];
            scope.searchResults = [];
            scope.routeTo = function (id) {
                location.path('/viewgroup/' + id);
            };

            scope.search = function () {
                location.path('/groups/' + scope.group.query);
            }

            if (routeParams.query == null) {

                if (!scope.searchCriteria.groups) {
                    scope.searchCriteria.groups = null;
                    scope.saveSC();
                }
                scope.filterText = scope.searchCriteria.groups;

                scope.onFilter = function () {
                    scope.searchCriteria.groups = scope.filterText;
                    scope.saveSC();
                };

                var fetchFunction = function (offset, limit, callback) {
                    resourceFactory.groupResource.get({
                        offset: offset, limit: limit, paged: 'true',
                        orderBy: 'name', sortOrder: 'ASC'
                    }, callback);
                };

                scope.groups = paginatorService.paginate(fetchFunction, 14);
            }

            scope.query = routeParams.query;
            if (routeParams.query == 'undefined') {
                routeParams.query = '';
            }
            resourceFactory.globalSearch.search({query: routeParams.query}, function (data) {
                scope.searchResults = data;
            });
        }
    });
    mifosX.ng.application.controller('GroupController', ['$scope', 'ResourceFactory', 'PaginatorService', '$location', '$routeParams', mifosX.controllers.GroupController]).run(function ($log) {
        $log.info("GroupController initialized");
    });
}(mifosX.controllers || {}));